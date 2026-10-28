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

import { ChatModal } from '@/components/ChatModal';
import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';

export default function ActiveParkingPassScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { bookings } = useParkStore();
  const {
    s,
    vs,
    ms,
    hPad,
    vGap,
    cardPad,
    headerHeight,
    headerTopPad,
    stickyFooterBottomPad,
    formMaxWidth,
    isSmallPhone,
  } = useResponsive();

  const booking = bookings.find((b) => b.id === id) || bookings[0];

  const [secondsRemaining, setSecondsRemaining] = useState(
    2 * 3600 + 48 * 60 + 15
  );
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
    return `${hrs.toString().padStart(2, '0')}h ${mins
      .toString()
      .padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
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
    setSecondsRemaining((sec) => sec + 3600);
    setExtended(true);
    setTimeout(() => setExtended(false), 3000);
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    setTimeout(() => setWalletAdded(false), 3000);
  };

  const iconBtnSize = ms(38);
  const qrSize = isSmallPhone ? 150 : ms(172);
  const pinBoxW = isSmallPhone ? 38 : ms(44);
  const pinBoxH = isSmallPhone ? 44 : ms(50);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerOuter, { paddingTop: headerTopPad }]}>
        <View
          style={[
            styles.headerInner,
            {
              height: headerHeight,
              paddingHorizontal: hPad,
              maxWidth: formMaxWidth,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                width: iconBtnSize,
                height: iconBtnSize,
                borderRadius: iconBtnSize / 2,
              },
            ]}
            onPress={() => router.replace('/(tabs)/bookings' as any)}
          >
            <MaterialIcons
              name="arrow-back"
              size={ms(22)}
              color={ParkColors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: ms(16.5) }]}>
            Active Parking Pass
          </Text>
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                width: iconBtnSize,
                height: iconBtnSize,
                borderRadius: iconBtnSize / 2,
              },
            ]}
            onPress={() => router.replace('/(tabs)' as any)}
          >
            <MaterialIcons name="home" size={ms(22)} color={ParkColors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            maxWidth: formMaxWidth,
            paddingHorizontal: hPad,
            paddingTop: vGap,
            gap: vGap,
            paddingBottom: stickyFooterBottomPad + vs(20),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Confirmed Hero Status Banner */}
        <View style={[styles.confirmedHero, { padding: cardPad, gap: s(12) }]}>
          <View
            style={[
              styles.confirmedIconCircle,
              {
                width: ms(46),
                height: ms(46),
                borderRadius: ms(23),
              },
            ]}
          >
            <MaterialIcons name="verified" size={ms(26)} color="#FFFFFF" />
          </View>
          <View style={styles.confirmedHeroText}>
            <View style={styles.confirmedNumberRow}>
              <Text style={[styles.confirmedTag, { fontSize: ms(10.5) }]}>
                CONFIRMED
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={[styles.bookingIdText, { fontSize: ms(11) }]}>
                #{booking.id}
              </Text>
            </View>
            <Text style={[styles.confirmedTitle, { fontSize: ms(18) }]}>
              Booking Confirmed!
            </Text>
            <Text style={[styles.confirmedSubtitle, { fontSize: ms(12) }]}>
              Gate sensor auto-sync ready
            </Text>
          </View>
          <View
            style={[
              styles.celebrationCircle,
              {
                width: ms(36),
                height: ms(36),
                borderRadius: ms(18),
              },
            ]}
          >
            <MaterialIcons
              name="celebration"
              size={ms(18)}
              color={ParkColors.secondary}
            />
          </View>
        </View>

        {/* Digital QR Entry Pass Artifact */}
        <View style={[styles.qrPassContainer, { padding: s(18), gap: vs(14) }]}>
          {/* Active Pass Status Pill */}
          <View
            style={[
              styles.passStatusPill,
              { paddingHorizontal: s(12), paddingVertical: vs(6) },
            ]}
          >
            <View style={styles.pulseDot} />
            <Text style={[styles.passStatusText, { fontSize: ms(12) }]}>
              Active Pass
            </Text>
            <Text style={styles.dot}>•</Text>
            <Text style={[styles.countdownText, { fontSize: ms(12) }]}>
              {formatTimer(secondsRemaining)}
            </Text>
          </View>

          {/* High Contrast QR Code Box */}
          <View style={[styles.qrCodeBox, { padding: s(16), gap: vs(12) }]}>
            <QRCode
              value={`PARKYAAR-${booking.id}-${booking.pin}`}
              size={qrSize}
              color={ParkColors.primary}
              backgroundColor="#FFFFFF"
            />
            <Text style={[styles.qrInstructions, { fontSize: ms(11.5) }]}>
              Show this QR at gate camera or scan host device on arrival.
            </Text>
          </View>

          {/* Gate Manual Entry PIN Strip */}
          <View style={[styles.pinSection, { gap: vs(6) }]}>
            <Text style={[styles.pinLabel, { fontSize: ms(10.5) }]}>
              GATE MANUAL ENTRY PIN
            </Text>
            <View style={[styles.pinRow, { gap: s(8) }]}>
              <View style={[styles.pinBoxes, { gap: s(8) }]}>
                {(booking.pin || '4892').split('').map((char, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.pinDigitBox,
                      { width: pinBoxW, height: pinBoxH },
                    ]}
                  >
                    <Text style={[styles.pinDigitText, { fontSize: ms(20) }]}>
                      {char}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={[
                  styles.copyPinBtn,
                  { width: pinBoxW, height: pinBoxH },
                ]}
                onPress={handleCopyPin}
              >
                <MaterialIcons
                  name="content-copy"
                  size={ms(18)}
                  color={ParkColors.secondary}
                />
              </TouchableOpacity>
            </View>
            {pinCopied && (
              <Text style={[styles.pinCopiedNotice, { fontSize: ms(11) }]}>
                PIN copied to clipboard!
              </Text>
            )}
          </View>
        </View>

        {/* Reservation Particulars Bento Grid */}
        <View style={[styles.particularsCard, { padding: cardPad, gap: vs(12) }]}>
          <View style={styles.particularsHeader}>
            <View style={styles.particularsTitleGroup}>
              <View style={styles.bayTagRow}>
                <MaterialIcons
                  name="garage"
                  size={ms(15)}
                  color={ParkColors.secondary}
                />
                <Text style={[styles.bayTagText, { fontSize: ms(10.5) }]}>
                  COVERED BAY
                </Text>
              </View>
              <Text
                style={[styles.particularsSpotTitle, { fontSize: ms(16) }]}
                numberOfLines={1}
              >
                {booking.listingTitle}
              </Text>
              <Text
                style={[styles.particularsAddress, { fontSize: ms(12) }]}
                numberOfLines={2}
              >
                {booking.listingAddress}
              </Text>
            </View>
            <View style={[styles.slotSpotBox, { padding: s(10) }]}>
              <Text style={[styles.slotSpotLabel, { fontSize: ms(10) }]}>
                Slot Spot
              </Text>
              <Text style={[styles.slotSpotValue, { fontSize: ms(14) }]}>
                {booking.bayNumber}
              </Text>
            </View>
          </View>

          {/* Mini Route Preview */}
          <TouchableOpacity
            style={[styles.routePreviewBox, { padding: s(10) }]}
            activeOpacity={0.88}
            onPress={handleNavigate}
          >
            <View style={styles.routeBadge}>
              <MaterialIcons
                name="navigation"
                size={ms(14)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.routeBadgeText, { fontSize: ms(12) }]}>
                1.4 km away • 6 mins driving
              </Text>
            </View>
          </TouchableOpacity>

          {/* 2-Column Info Grid */}
          <View style={[styles.twoColGrid, { gap: s(10) }]}>
            <View style={[styles.gridBox, { padding: s(10) }]}>
              <View style={styles.gridBoxHeader}>
                <MaterialIcons
                  name="schedule"
                  size={ms(13)}
                  color={ParkColors.textMuted}
                />
                <Text style={[styles.gridBoxLabel, { fontSize: ms(11) }]}>
                  Time Window
                </Text>
              </View>
              <Text
                style={[styles.gridBoxValue, { fontSize: ms(12.5) }]}
                numberOfLines={1}
              >
                {booking.durationLabel}
              </Text>
            </View>

            <View style={[styles.gridBox, { padding: s(10) }]}>
              <View style={styles.gridBoxHeader}>
                <MaterialIcons
                  name="directions-car"
                  size={ms(13)}
                  color={ParkColors.textMuted}
                />
                <Text style={[styles.gridBoxLabel, { fontSize: ms(11) }]}>
                  Vehicle Assigned
                </Text>
              </View>
              <Text
                style={[styles.gridBoxValue, { fontSize: ms(12.5) }]}
                numberOfLines={1}
              >
                {booking.vehicle.model} • {booking.vehicle.plate}
              </Text>
            </View>
          </View>
        </View>

        {/* Verified Host Trust & Quick Actions */}
        <View style={[styles.hostCard, { padding: cardPad, gap: vs(12) }]}>
          <View style={styles.hostCardTop}>
            <View style={[styles.hostAvatarRow, { gap: s(10) }]}>
              <Image
                source={{ uri: booking.hostPhoto }}
                style={[
                  styles.hostAvatar,
                  {
                    width: ms(44),
                    height: ms(44),
                    borderRadius: ms(22),
                  },
                ]}
              />
              <View style={{ flex: 1 }}>
                <View style={styles.hostNameRow}>
                  <Text
                    style={[styles.hostNameText, { fontSize: ms(14.5) }]}
                    numberOfLines={1}
                  >
                    {booking.hostName}
                  </Text>
                  <MaterialIcons
                    name="verified"
                    size={ms(14)}
                    color={ParkColors.secondary}
                  />
                </View>
                <View style={styles.hostRatingRow}>
                  <MaterialIcons
                    name="star"
                    size={ms(13)}
                    color={ParkColors.amber}
                  />
                  <Text style={[styles.hostRatingText, { fontSize: ms(11.5) }]}>
                    4.96 (112 stays) • Superhost
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.hostNearbyPill}>
              <Text style={[styles.hostNearbyText, { fontSize: ms(10) }]}>
                Host Nearby
              </Text>
            </View>
          </View>

          {/* Action Cluster: Call, Chat, Navigate */}
          <View style={[styles.actionCluster, { gap: s(8) }]}>
            <TouchableOpacity
              style={[styles.clusterBtn, { paddingVertical: vs(10) }]}
              activeOpacity={0.75}
              onPress={handleCallHost}
            >
              <MaterialIcons
                name="phone-in-talk"
                size={ms(20)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.clusterBtnTitle, { fontSize: ms(12) }]}>
                Call Host
              </Text>
              <Text style={[styles.clusterBtnSub, { fontSize: ms(10) }]}>
                Masked
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.clusterBtn, { paddingVertical: vs(10) }]}
              activeOpacity={0.75}
              onPress={() => setChatVisible(true)}
            >
              <MaterialIcons
                name="chat"
                size={ms(20)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.clusterBtnTitle, { fontSize: ms(12) }]}>
                Chat
              </Text>
              <Text style={[styles.clusterBtnSub, { fontSize: ms(10) }]}>
                Avg 2m reply
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.clusterBtn, { paddingVertical: vs(10) }]}
              activeOpacity={0.75}
              onPress={handleNavigate}
            >
              <MaterialIcons
                name="near-me"
                size={ms(20)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.clusterBtnTitle, { fontSize: ms(12) }]}>
                Navigate
              </Text>
              <Text style={[styles.clusterBtnSub, { fontSize: ms(10) }]}>
                Maps / Waze
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Summary Drawer */}
        <View
          style={[styles.paymentReceiptCard, { padding: cardPad, gap: vs(12) }]}
        >
          <View style={styles.receiptHeader}>
            <Text style={[styles.receiptTitle, { fontSize: ms(15) }]}>
              Payment Summary
            </Text>
            <View style={styles.paidBadge}>
              <Text style={[styles.paidBadgeText, { fontSize: ms(10) }]}>
                PAID IN FULL
              </Text>
            </View>
          </View>

          <View style={[styles.receiptRows, { gap: vs(8) }]}>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { fontSize: ms(12.5) }]}>
                Parking Duration ({booking.hours} hrs × Rs {booking.hourlyRate})
              </Text>
              <Text style={[styles.receiptVal, { fontSize: ms(13) }]}>
                Rs {booking.hours * booking.hourlyRate}
              </Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { fontSize: ms(12.5) }]}>
                Municipal Space Fee & SafePark
              </Text>
              <Text style={[styles.receiptVal, { fontSize: ms(13) }]}>
                Rs {booking.serviceFee}
              </Text>
            </View>
            <View style={[styles.receiptTotalRow, { paddingTop: vs(8) }]}>
              <Text style={[styles.receiptTotalLabel, { fontSize: ms(14) }]}>
                Total Paid
              </Text>
              <Text style={[styles.receiptTotalVal, { fontSize: ms(17) }]}>
                Rs {booking.total}
              </Text>
            </View>
          </View>

          {/* Payment Method Used */}
          <View style={[styles.methodStrip, { padding: s(10) }]}>
            <View style={[styles.methodLeft, { gap: s(10) }]}>
              <View
                style={[
                  styles.methodBadge,
                  {
                    width: ms(34),
                    height: ms(34),
                    borderRadius: ms(8),
                  },
                ]}
              >
                <Text style={[styles.methodBadgeText, { fontSize: ms(12) }]}>
                  JC
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.methodName, { fontSize: ms(12.5) }]}
                  numberOfLines={1}
                >
                  {booking.paymentMethod}
                </Text>
                <Text style={[styles.methodRef, { fontSize: ms(10.5) }]}>
                  Ref: TXN-892144 Lahore
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="check-circle"
              size={ms(18)}
              color={ParkColors.secondary}
            />
          </View>

          <View style={styles.sandboxNote}>
            <MaterialIcons
              name="science"
              size={ms(14)}
              color={ParkColors.textMuted}
            />
            <Text style={[styles.sandboxNoteText, { fontSize: ms(11) }]}>
              Sandbox Mode: No real PKR charged to wallet.
            </Text>
          </View>
        </View>

        {/* Primary Control Buttons */}
        <View style={[styles.controlButtonsSection, { gap: vs(10) }]}>
          <TouchableOpacity
            style={[
              styles.walletBtn,
              { height: ms(48) },
              walletAdded && styles.walletBtnSuccess,
            ]}
            activeOpacity={0.85}
            onPress={handleAddToWallet}
          >
            <MaterialIcons
              name={walletAdded ? 'check-circle' : 'wallet'}
              size={ms(19)}
              color="#FFFFFF"
            />
            <Text style={[styles.walletBtnText, { fontSize: ms(14) }]}>
              {walletAdded
                ? 'Pass Saved to Wallet!'
                : 'Add Pass to Google / Apple Wallet'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.extendBtn,
              { height: ms(48) },
              extended && styles.extendBtnSuccess,
            ]}
            activeOpacity={0.85}
            onPress={handleExtendPass}
          >
            <MaterialIcons
              name={extended ? 'check' : 'more-time'}
              size={ms(19)}
              color={extended ? ParkColors.success : ParkColors.secondary}
            />
            <Text
              style={[
                styles.extendBtnText,
                { fontSize: ms(14) },
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
  headerOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
  },
  headerInner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
    alignSelf: 'center',
  },
  confirmedHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  confirmedIconCircle: {
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedHeroText: {
    flex: 1,
    gap: 2,
  },
  confirmedNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  confirmedTag: {
    fontWeight: '800',
    color: ParkColors.secondary,
    letterSpacing: 0.5,
  },
  dot: {
    color: ParkColors.textMuted,
  },
  bookingIdText: {
    fontWeight: '700',
    color: ParkColors.textMuted,
  },
  confirmedTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  confirmedSubtitle: {
    color: ParkColors.textMuted,
  },
  celebrationCircle: {
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPassContainer: {
    backgroundColor: ParkColors.primary,
    borderRadius: ParkRadii.xl,
    alignItems: 'center',
    ...ParkShadows.md,
  },
  passStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 9999,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  passStatusText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  countdownText: {
    color: '#34D399',
    fontWeight: '800',
  },
  qrCodeBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    alignItems: 'center',
  },
  qrInstructions: {
    color: ParkColors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
  },
  pinSection: {
    width: '100%',
    alignItems: 'center',
  },
  pinLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinBoxes: {
    flexDirection: 'row',
  },
  pinDigitBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDigitText: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  copyPinBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCopiedNotice: {
    color: '#34D399',
    fontWeight: '700',
    marginTop: 2,
  },
  particularsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  particularsHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  particularsTitleGroup: {
    flex: 1,
    gap: 3,
  },
  bayTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bayTagText: {
    fontWeight: '800',
    color: ParkColors.secondary,
  },
  particularsSpotTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  particularsAddress: {
    color: ParkColors.textMuted,
  },
  slotSpotBox: {
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  slotSpotLabel: {
    color: ParkColors.textMuted,
    fontWeight: '600',
  },
  slotSpotValue: {
    fontWeight: '800',
    color: ParkColors.primary,
    marginTop: 2,
  },
  routePreviewBox: {
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    alignItems: 'center',
  },
  routeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  routeBadgeText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  twoColGrid: {
    flexDirection: 'row',
  },
  gridBox: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 4,
  },
  gridBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridBoxLabel: {
    color: ParkColors.textMuted,
    fontWeight: '600',
  },
  gridBoxValue: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  hostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  hostCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  hostAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hostAvatar: {
    backgroundColor: ParkColors.surfaceHigh,
  },
  hostNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hostNameText: {
    fontWeight: '700',
    color: ParkColors.primary,
    flexShrink: 1,
  },
  hostRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  hostRatingText: {
    color: ParkColors.textMuted,
  },
  hostNearbyPill: {
    backgroundColor: ParkColors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  hostNearbyText: {
    fontWeight: '700',
    color: ParkColors.success,
  },
  actionCluster: {
    flexDirection: 'row',
  },
  clusterBtn: {
    flex: 1,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  clusterBtnTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
    marginTop: 2,
  },
  clusterBtnSub: {
    color: ParkColors.textMuted,
  },
  paymentReceiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  receiptTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  paidBadge: {
    backgroundColor: ParkColors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  paidBadgeText: {
    fontWeight: '800',
    color: ParkColors.success,
  },
  receiptRows: {
    width: '100%',
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    color: ParkColors.textMuted,
  },
  receiptVal: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  receiptTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
  },
  receiptTotalLabel: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  receiptTotalVal: {
    fontWeight: '900',
    color: ParkColors.primary,
  },
  methodStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodBadge: {
    backgroundColor: '#D91D24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  methodName: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  methodRef: {
    color: ParkColors.textMuted,
  },
  sandboxNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  sandboxNoteText: {
    color: ParkColors.textMuted,
  },
  controlButtonsSection: {
    width: '100%',
  },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ParkColors.primary,
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  walletBtnSuccess: {
    backgroundColor: ParkColors.success,
  },
  walletBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  extendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: ParkColors.secondary,
  },
  extendBtnSuccess: {
    borderColor: ParkColors.success,
    backgroundColor: ParkColors.successLight,
  },
  extendBtnText: {
    color: ParkColors.secondary,
    fontWeight: '700',
  },
});
