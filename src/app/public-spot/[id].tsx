import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';

export default function PublicSpotDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { listings } = useParkStore();

  const spot =
    listings.find((l) => l.id === id) ||
    listings.find((l) => l.type === 'public') ||
    listings[0];

  const total = spot.totalSpots || 300;
  const free = spot.freeSpots || 128;
  const percentOccupied = Math.round(((total - free) / total) * 100);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={ParkColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Public Plaza</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroBox}>
          <Image source={{ uri: spot.photos[0] }} style={styles.heroImage} />
          <View style={styles.corporateBadge}>
            <MaterialIcons name="business" size={13} color="#FFFFFF" />
            <Text style={styles.corporateBadgeText}>Municipal Smart Parking</Text>
          </View>
        </View>

        {/* Title & Organization */}
        <View style={styles.titleCard}>
          <View style={styles.publicTagRow}>
            <View style={styles.amberTag}>
              <Text style={styles.amberTagText}>COMMERCIAL LOT</Text>
            </View>
            <Text style={styles.rateHighlight}>Rs {spot.pricePerHour}/hr</Text>
          </View>

          <Text style={styles.spotTitle}>{spot.title}</Text>
          <Text style={styles.spotAddress}>{spot.address}</Text>

          {/* Live Capacity Bar */}
          <View style={styles.capacityContainer}>
            <View style={styles.capacityHeader}>
              <View style={styles.capacityTitleRow}>
                <View style={styles.liveGreenDot} />
                <Text style={styles.capacityTitle}>Real-Time Bay Availability</Text>
              </View>
              <Text style={styles.capacityCount}>
                <Text style={{ fontWeight: '800', color: ParkColors.secondary }}>{free}</Text> of {total} free
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${percentOccupied}%` },
                ]}
              />
            </View>
            <View style={styles.capacityFooter}>
              <Text style={styles.capacityFooterText}>{percentOccupied}% Occupied</Text>
              <Text style={styles.capacityFooterText}>Updated 30s ago</Text>
            </View>
          </View>
        </View>

        {/* Pricing Tiers Table */}
        <View style={styles.pricingCard}>
          <Text style={styles.cardHeader}>Official Tariff Schedule</Text>
          <View style={styles.tariffRow}>
            <Text style={styles.tariffLabel}>Hourly Standard</Text>
            <Text style={styles.tariffValue}>Rs {spot.pricePerHour}/hr</Text>
          </View>
          <View style={styles.tariffRow}>
            <Text style={styles.tariffLabel}>Full Day Commercial Pass</Text>
            <Text style={styles.tariffValue}>Rs {spot.pricePerDay}/day</Text>
          </View>
          <View style={styles.tariffRow}>
            <Text style={styles.tariffLabel}>Monthly Dedicated Corporate Pass</Text>
            <Text style={styles.tariffValue}>Rs {spot.pricePerMonth}/mo</Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesCard}>
          <Text style={styles.cardHeader}>Plaza Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {spot.features.map((feat, i) => (
              <View key={i} style={styles.amenityItem}>
                <MaterialIcons name="check-circle" size={16} color={ParkColors.secondary} />
                <Text style={styles.amenityText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Dual Action Bar */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
        <TouchableOpacity
          style={styles.scanQrBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/qr-scan' as any)}
        >
          <MaterialIcons name="qr-code-scanner" size={20} color={ParkColors.secondary} />
          <Text style={styles.scanQrBtnText}>Scan QR at Barrier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyTicketBtn}
          activeOpacity={0.88}
          onPress={() => router.push(`/booking/${spot.id}` as any)}
        >
          <Text style={styles.buyTicketBtnText}>Buy Ticket in App</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 120,
  },
  heroBox: {
    height: 200,
    borderRadius: ParkRadii.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: ParkColors.surfaceHigh,
    ...ParkShadows.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  corporateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(11, 37, 69, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  corporateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  titleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 10,
    ...ParkShadows.sm,
  },
  publicTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amberTag: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  amberTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#362000',
  },
  rateHighlight: {
    fontSize: 16,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  spotTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: ParkColors.text,
  },
  spotAddress: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  capacityContainer: {
    backgroundColor: ParkColors.surfaceLow,
    padding: 12,
    borderRadius: ParkRadii.md,
    gap: 8,
    marginTop: 4,
  },
  capacityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  capacityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  capacityTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.text,
  },
  capacityCount: {
    fontSize: 12,
    color: ParkColors.textVariant,
  },
  progressTrack: {
    width: '100%',
    height: 10,
    backgroundColor: ParkColors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ParkColors.secondary,
    borderRadius: 5,
  },
  capacityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capacityFooterText: {
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 10,
    ...ParkShadows.sm,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  tariffRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
  },
  tariffLabel: {
    fontSize: 13,
    color: ParkColors.textVariant,
  },
  tariffValue: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  amenitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 12,
    ...ParkShadows.sm,
  },
  amenitiesGrid: {
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityText: {
    fontSize: 13,
    color: ParkColors.text,
  },
  stickyFooter: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 10,
    ...ParkShadows.sheet,
  },
  scanQrBtn: {
    flex: 1,
    height: 52,
    borderRadius: 9999,
    backgroundColor: ParkColors.surfaceLow,
    borderWidth: 1.5,
    borderColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  scanQrBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  buyTicketBtn: {
    flex: 1,
    height: 52,
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...ParkShadows.md,
  },
  buyTicketBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

