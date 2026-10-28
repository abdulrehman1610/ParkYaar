import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Clipboard,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatModal } from '@/components/ChatModal';
import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';

export default function ActiveParkingPassScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { bookings } = useParkStore();

  const booking = bookings.find((b) => b.id === id) || bookings[0];

  const [secondsRemaining, setSecondsRemaining] = useState(2 * 3600 + 48 * 60 + 15);
  const [pinCopied, setPinCopied] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);
  const [extended, setExtended] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  // Live countdown timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((sec) => (sec > 0 ? sec - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    if (totalSec <= 0) return 'Pass Expired';
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleCopyPin = () => {
    Clipboard.setString(booking.pin || '4892');
    setPinCopied(true);
    setTimeout(() => setPinCopied(false), 2500);
  };

  const handleCallHost = () => {
    Alert.alert(
      'Call Host (Masked Relay)',
      `Connecting to host via ParkYaar Secure Caller ID: 042-111-PARK (Host: ${booking.hostName})`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dial',
          onPress: () => {
            Linking.openURL(`tel:042111537275`).catch(() => {});
          },
        },
      ]
    );
  };

  const handleNavigate = () => {
    const lat = 31.5135;
    const lng = 74.3468;
    const url = Platform.select({
      ios: `maps:0,0?q=${booking.listingTitle}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${booking.listingTitle})`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    });
    Linking.openURL(url as string).catch(() => {
      Alert.alert('Navigation', `Opening route to ${booking.listingAddress}`);
    });
  };

  const handleExtendPass = () => {
    setSecondsRemaining((s) => s + 3600);
    setExtended(true);
    setTimeout(() => setExtended(false), 3000);
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => setWalletAdded(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.replace('/(tabs)/bookings' as any)}
        >
          <MaterialIcons name="arrow-back" size={24} color={ParkColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Parking Pass</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <MaterialIcons name="home" size={24} color={ParkColors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Confirmed Hero Status Banner */}
        <View style={styles.confirmedHero}>
          <View style={styles.confirmedIconCircle}>
            <MaterialIcons name="verified" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.confirmedHeroText}>
            <View style={styles.confirmedNumberRow}>
              <Text style={styles.confirmedTag}>CONFIRMED</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.bookingIdText}>#{booking.id}</Text>
            </View>
            <Text style={styles.confirmedTitle}>Booking Confirmed!</Text>
            <Text style={styles.confirmedSubtitle}>Gate sensor auto-sync ready</Text>
          </View>
          <View style={styles.celebrationCircle}>
            <MaterialIcons name="celebration" size={20} color={ParkColors.secondary} />
          </View>
        </View>

        {/* Digital QR Entry Pass Artifact */}
        <View style={styles.qrPassContainer}>
          {/* Active Pass Status Pill */}
          <View style={styles.passStatusPill}>
            <View style={styles.pulseDot} />
            <Text style={styles.passStatusText}>Active Pass</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.countdownText}>
              {formatTimer(secondsRemaining)}
            </Text>
          </View>

          {/* High Contrast QR Code Box */}
          <View style={styles.qrCodeBox}>
            <QRCode
              value={`PARKYAAR-${booking.id}-${booking.pin}`}
              size={180}
              color={ParkColors.primary}
              backgroundColor="#FFFFFF"
            />
            <Text style={styles.qrInstructions}>
              Show this QR at gate camera or scan host device on arrival.
            </Text>
          </View>

          {/* Gate Manual Entry PIN Strip */}
          <View style={styles.pinSection}>
            <Text style={styles.pinLabel}>GATE MANUAL ENTRY PIN</Text>
            <View style={styles.pinRow}>
              <View style={styles.pinBoxes}>
                {(booking.pin || '4892').split('').map((char, idx) => (
                  <View key={idx} style={styles.pinDigitBox}>
                    <Text style={styles.pinDigitText}>{char}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={styles.copyPinBtn}
                onPress={handleCopyPin}
              >
                <MaterialIcons name="content-copy" size={18} color={ParkColors.secondary} />
              </TouchableOpacity>
            </View>
            {pinCopied && (
              <Text style={styles.pinCopiedNotice}>PIN copied to clipboard!</Text>
            )}
          </View>
        </View>

        {/* Reservation Particulars Bento Grid */}
        <View style={styles.particularsCard}>
          <View style={styles.particularsHeader}>
            <View style={styles.particularsTitleGroup}>
              <View style={styles.bayTagRow}>
                <MaterialIcons name="garage" size={16} color={ParkColors.secondary} />
                <Text style={styles.bayTagText}>COVERED BAY</Text>
              </View>
              <Text style={styles.particularsSpotTitle}>
                {booking.listingTitle}
              </Text>
              <Text style={styles.particularsAddress}>
                {booking.listingAddress}
              </Text>
            </View>
            <View style={styles.slotSpotBox}>
              <Text style={styles.slotSpotLabel}>Slot Spot</Text>
              <Text style={styles.slotSpotValue}>{booking.bayNumber}</Text>
            </View>
          </View>

          {/* Mini Route Preview */}
          <TouchableOpacity
            style={styles.routePreviewBox}
            activeOpacity={0.88}
            onPress={handleNavigate}
          >
            <View style={styles.routeBadge}>
              <MaterialIcons name="navigation" size={14} color={ParkColors.secondary} />
              <Text style={styles.routeBadgeText}>
                1.4 km away • 6 mins driving
              </Text>
            </View>
          </TouchableOpacity>

          {/* 2-Column Info Grid */}
          <View style={styles.twoColGrid}>
            <View style={styles.gridBox}>
              <View style={styles.gridBoxHeader}>
                <MaterialIcons name="schedule" size={14} color={ParkColors.textMuted} />
                <Text style={styles.gridBoxLabel}>Time Window</Text>
              </View>
              <Text style={styles.gridBoxValue}>{booking.durationLabel}</Text>
            </View>

            <View style={styles.gridBox}>
              <View style={styles.gridBoxHeader}>
                <MaterialIcons name="directions-car" size={14} color={ParkColors.textMuted} />
                <Text style={styles.gridBoxLabel}>Vehicle Assigned</Text>
              </View>
              <Text style={styles.gridBoxValue} numberOfLines={1}>
                {booking.vehicle.model} • {booking.vehicle.plate}
              </Text>
            </View>
          </View>
        </View>

        {/* Verified Host Trust & Quick Actions */}
        <View style={styles.hostCard}>
          <View style={styles.hostCardTop}>
            <View style={styles.hostAvatarRow}>
              <Image source={{ uri: booking.hostPhoto }} style={styles.hostAvatar} />
              <View>
                <View style={styles.hostNameRow}>
                  <Text style={styles.hostNameText}>{booking.hostName}</Text>
                  <MaterialIcons name="verified" size={14} color={ParkColors.secondary} />
                </View>
                <View style={styles.hostRatingRow}>
                  <MaterialIcons name="star" size={13} color={ParkColors.amber} />
                  <Text style={styles.hostRatingText}>4.96 (112 stays) • Superhost</Text>
                </View>
              </View>
            </View>
            <View style={styles.hostNearbyPill}>
              <Text style={styles.hostNearbyText}>Host Nearby</Text>
            </View>
          </View>

          {/* Action Cluster: Call, Chat, Navigate */}
          <View style={styles.actionCluster}>
            <TouchableOpacity
              style={styles.clusterBtn}
              activeOpacity={0.75}
              onPress={handleCallHost}
            >
              <MaterialIcons name="phone-in-talk" size={22} color={ParkColors.secondary} />
              <Text style={styles.clusterBtnTitle}>Call Host</Text>
              <Text style={styles.clusterBtnSub}>Masked</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clusterBtn}
              activeOpacity={0.75}
              onPress={() => setChatVisible(true)}
            >
              <MaterialIcons name="chat" size={22} color={ParkColors.secondary} />
              <Text style={styles.clusterBtnTitle}>Chat</Text>
              <Text style={styles.clusterBtnSub}>Avg 2m reply</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clusterBtn}
              activeOpacity={0.75}
              onPress={handleNavigate}
            >
              <MaterialIcons name="near-me" size={22} color={ParkColors.secondary} />
              <Text style={styles.clusterBtnTitle}>Navigate</Text>
              <Text style={styles.clusterBtnSub}>Maps / Waze</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Summary Drawer */}
        <View style={styles.paymentReceiptCard}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>Payment Summary</Text>
            <View style={styles.paidBadge}>
              <Text style={styles.paidBadgeText}>PAID IN FULL</Text>
            </View>
          </View>

          <View style={styles.receiptRows}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>
                Parking Duration ({booking.hours} hrs × Rs {booking.hourlyRate})
              </Text>
              <Text style={styles.receiptVal}>
                Rs {booking.hours * booking.hourlyRate}
              </Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Municipal Space Fee & SafePark</Text>
              <Text style={styles.receiptVal}>Rs {booking.serviceFee}</Text>
            </View>
            <View style={styles.receiptTotalRow}>
              <Text style={styles.receiptTotalLabel}>Total Paid</Text>
              <Text style={styles.receiptTotalVal}>Rs {booking.total}</Text>
            </View>
          </View>

          {/* Payment Method Used */}
          <View style={styles.methodStrip}>
            <View style={styles.methodLeft}>
              <View style={styles.methodBadge}>
                <Text style={styles.methodBadgeText}>JC</Text>
              </View>
              <View>
                <Text style={styles.methodName}>{booking.paymentMethod}</Text>
                <Text style={styles.methodRef}>Ref: TXN-892144 Lahore</Text>
              </View>
            </View>
            <MaterialIcons name="check-circle" size={18} color={ParkColors.secondary} />
          </View>

          <View style={styles.sandboxNote}>
            <MaterialIcons name="science" size={14} color={ParkColors.textMuted} />
            <Text style={styles.sandboxNoteText}>
              Sandbox Mode: No real PKR charged to wallet.
            </Text>
          </View>
        </View>

        {/* Primary Control Buttons */}
        <View style={styles.controlButtonsSection}>
          <TouchableOpacity
            style={[styles.walletBtn, walletAdded && styles.walletBtnSuccess]}
            activeOpacity={0.85}
            onPress={handleAddToWallet}
          >
            <MaterialIcons
              name={walletAdded ? 'check-circle' : 'wallet'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.walletBtnText}>
              {walletAdded
                ? 'Pass Saved to Wallet!'
                : 'Add Pass to Google / Apple Wallet'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.extendBtn, extended && styles.extendBtnSuccess]}
            activeOpacity={0.85}
            onPress={handleExtendPass}
          >
            <MaterialIcons
              name={extended ? 'check' : 'more-time'}
              size={20}
              color={extended ? ParkColors.success : ParkColors.secondary}
            />
            <Text
              style={[
                styles.extendBtnText,
                extended && { color: ParkColors.success },
              ]}
            >
              {extended
                ? 'Extended +1 Hour (Rs 150 Added)'
                : 'Extend Parking Time (+1 hr Rs 150)'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Chat with Host Modal */}
      <ChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        hostName={booking.hostName}
        hostPhoto={booking.hostPhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParkColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  confirmedHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 12,
    ...ParkShadows.md,
  },
  confirmedIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedHeroText: {
    flex: 1,
  },
  confirmedNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  confirmedTag: {
    fontSize: 10,
    fontWeight: '800',
    color: ParkColors.secondary,
    letterSpacing: 0.5,
  },
  dot: {
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  bookingIdText: {
    fontSize: 11,
    color: ParkColors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '600',
  },
  confirmedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ParkColors.text,
  },
  confirmedSubtitle: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 1,
  },
  celebrationCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPassContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.xl,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.lg,
  },
  passStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ParkColors.secondary,
  },
  passStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.text,
  },
  countdownText: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  qrCodeBox: {
    marginVertical: 18,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  qrInstructions: {
    fontSize: 11,
    color: ParkColors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 220,
    lineHeight: 15,
  },
  pinSection: {
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    paddingTop: 14,
  },
  pinLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: ParkColors.textMuted,
    letterSpacing: 1,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  pinBoxes: {
    flexDirection: 'row',
    gap: 6,
  },
  pinDigitBox: {
    width: 32,
    height: 36,
    borderRadius: 6,
    backgroundColor: ParkColors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDigitText: {
    fontSize: 18,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  copyPinBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCopiedNotice: {
    fontSize: 11,
    color: ParkColors.secondary,
    fontWeight: '600',
    marginTop: 6,
  },
  particularsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 12,
    ...ParkShadows.sm,
  },
  particularsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  particularsTitleGroup: {
    flex: 1,
    paddingRight: 8,
  },
  bayTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  bayTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: ParkColors.secondary,
  },
  particularsSpotTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ParkColors.text,
  },
  particularsAddress: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  slotSpotBox: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ParkRadii.sm,
    alignItems: 'center',
  },
  slotSpotLabel: {
    fontSize: 9,
    color: ParkColors.textMuted,
  },
  slotSpotValue: {
    fontSize: 14,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  routePreviewBox: {
    height: 70,
    borderRadius: ParkRadii.md,
    backgroundColor: '#CBD8EE',
    justifyContent: 'flex-end',
    padding: 8,
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  routeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: ParkColors.text,
  },
  twoColGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  gridBox: {
    flex: 1,
    backgroundColor: ParkColors.surfaceLow,
    padding: 10,
    borderRadius: ParkRadii.md,
  },
  gridBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridBoxLabel: {
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  gridBoxValue: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.text,
    marginTop: 4,
  },
  hostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 12,
    ...ParkShadows.sm,
  },
  hostCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hostAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ParkColors.surfaceHigh,
  },
  hostNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hostNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  hostRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  hostRatingText: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
  hostNearbyPill: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  hostNearbyText: {
    fontSize: 10,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  actionCluster: {
    flexDirection: 'row',
    gap: 10,
  },
  clusterBtn: {
    flex: 1,
    backgroundColor: ParkColors.surfaceLow,
    paddingVertical: 10,
    borderRadius: ParkRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterBtnTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.text,
    marginTop: 4,
  },
  clusterBtnSub: {
    fontSize: 9,
    color: ParkColors.textMuted,
    marginTop: 1,
  },
  paymentReceiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 10,
    ...ParkShadows.sm,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  paidBadge: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  paidBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: ParkColors.secondary,
  },
  receiptRows: {
    gap: 6,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.text,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
  },
  receiptTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  receiptTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: ParkColors.primary,
  },
  methodStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.surfaceLow,
    padding: 10,
    borderRadius: ParkRadii.md,
    marginTop: 4,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#D91D24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  methodName: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.text,
  },
  methodRef: {
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  sandboxNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  sandboxNoteText: {
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  controlButtonsSection: {
    gap: 10,
    marginTop: 6,
  },
  walletBtn: {
    height: 50,
    borderRadius: 9999,
    backgroundColor: ParkColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ParkShadows.md,
  },
  walletBtnSuccess: {
    backgroundColor: ParkColors.success,
  },
  walletBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  extendBtn: {
    height: 50,
    borderRadius: 9999,
    backgroundColor: ParkColors.surfaceLow,
    borderWidth: 1,
    borderColor: ParkColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  extendBtnSuccess: {
    backgroundColor: ParkColors.successLight,
    borderColor: ParkColors.success,
  },
  extendBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
});

