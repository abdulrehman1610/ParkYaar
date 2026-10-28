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

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';

export default function PublicSpotScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings } = useParkStore();
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
    contentMaxWidth,
    isSmallPhone,
  } = useResponsive();

  const spot =
    listings.find((l) => l.id === id) ||
    listings.find((l) => l.type === 'public') ||
    listings[0];

  const total = spot.totalSpots || 120;
  const free = spot.freeSpots || 42;
  const percentOccupied = Math.round(((total - free) / total) * 100);
  const iconBtnSize = ms(38);

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
              maxWidth: contentMaxWidth,
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
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back"
              size={ms(22)}
              color={ParkColors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: ms(16.5) }]}>
            Public Plaza
          </Text>
          <View style={{ width: iconBtnSize }} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: contentMaxWidth,
            paddingHorizontal: hPad,
            paddingTop: vGap,
            gap: vGap,
            paddingBottom: vs(125),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={[styles.heroBox, { height: vs(200) }]}>
          <Image source={{ uri: spot.photos[0] }} style={styles.heroImage} />
          <View
            style={[
              styles.corporateBadge,
              {
                top: s(12),
                left: s(12),
                paddingHorizontal: s(10),
                paddingVertical: vs(5),
              },
            ]}
          >
            <MaterialIcons name="business" size={ms(13)} color="#FFFFFF" />
            <Text style={[styles.corporateBadgeText, { fontSize: ms(11) }]}>
              Municipal Smart Parking
            </Text>
          </View>
        </View>

        {/* Title & Organization */}
        <View style={[styles.titleCard, { padding: cardPad, gap: vs(10) }]}>
          <View style={styles.publicTagRow}>
            <View style={styles.amberTag}>
              <Text style={[styles.amberTagText, { fontSize: ms(10) }]}>
                COMMERCIAL LOT
              </Text>
            </View>
            <Text style={[styles.rateHighlight, { fontSize: ms(18) }]}>
              Rs {spot.pricePerHour}/hr
            </Text>
          </View>

          <Text style={[styles.spotTitle, { fontSize: ms(20) }]}>
            {spot.title}
          </Text>
          <Text style={[styles.spotAddress, { fontSize: ms(12.5) }]}>
            {spot.address}
          </Text>

          {/* Live Capacity Bar */}
          <View
            style={[
              styles.capacityContainer,
              { padding: s(12), gap: vs(8), marginTop: vs(4) },
            ]}
          >
            <View style={styles.capacityHeader}>
              <View style={styles.capacityTitleRow}>
                <View style={styles.liveGreenDot} />
                <Text style={[styles.capacityTitle, { fontSize: ms(12.5) }]}>
                  Real-Time Bay Availability
                </Text>
              </View>
              <Text style={[styles.capacityCount, { fontSize: ms(12.5) }]}>
                <Text
                  style={{ fontWeight: '800', color: ParkColors.secondary }}
                >
                  {free}
                </Text>{' '}
                of {total} free
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${percentOccupied}%` }]}
              />
            </View>
            <View style={styles.capacityFooter}>
              <Text style={[styles.capacityFooterText, { fontSize: ms(11) }]}>
                {percentOccupied}% Occupied
              </Text>
              <Text style={[styles.capacityFooterText, { fontSize: ms(11) }]}>
                Updated 30s ago
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing Tiers Table */}
        <View style={[styles.pricingCard, { padding: cardPad, gap: vs(10) }]}>
          <Text style={[styles.cardHeader, { fontSize: ms(15.5) }]}>
            Official Tariff Schedule
          </Text>
          <View style={[styles.tariffRow, { paddingVertical: vs(8) }]}>
            <Text style={[styles.tariffLabel, { fontSize: ms(13) }]}>
              Hourly Standard
            </Text>
            <Text style={[styles.tariffValue, { fontSize: ms(14) }]}>
              Rs {spot.pricePerHour}/hr
            </Text>
          </View>
          <View style={[styles.tariffRow, { paddingVertical: vs(8) }]}>
            <Text style={[styles.tariffLabel, { fontSize: ms(13) }]}>
              Full Day Commercial Pass
            </Text>
            <Text style={[styles.tariffValue, { fontSize: ms(14) }]}>
              Rs {spot.pricePerDay}/day
            </Text>
          </View>
          <View style={[styles.tariffRow, { paddingVertical: vs(8) }]}>
            <Text style={[styles.tariffLabel, { fontSize: ms(13) }]}>
              Monthly Dedicated Corporate Pass
            </Text>
            <Text style={[styles.tariffValue, { fontSize: ms(14) }]}>
              Rs {spot.pricePerMonth}/mo
            </Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={[styles.amenitiesCard, { padding: cardPad, gap: vs(10) }]}>
          <Text style={[styles.cardHeader, { fontSize: ms(15.5) }]}>
            Plaza Amenities
          </Text>
          <View style={[styles.amenitiesGrid, { gap: vs(8) }]}>
            {spot.features.map((feat, i) => (
              <View key={i} style={styles.amenityItem}>
                <MaterialIcons
                  name="check-circle"
                  size={ms(16)}
                  color={ParkColors.secondary}
                />
                <Text style={[styles.amenityText, { fontSize: ms(13) }]}>
                  {feat}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Dual Action Bar */}
      <View
        style={[
          styles.stickyFooterOuter,
          {
            paddingBottom: stickyFooterBottomPad,
            paddingTop: vs(12),
            paddingHorizontal: hPad,
          },
        ]}
      >
        <View
          style={[
            styles.stickyFooterInner,
            {
              maxWidth: contentMaxWidth,
              gap: isSmallPhone ? 8 : s(10),
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.scanQrBtn, { height: ms(48) }]}
            activeOpacity={0.85}
            onPress={() => router.push('/qr-scan' as any)}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={ms(19)}
              color={ParkColors.secondary}
            />
            <Text
              style={[styles.scanQrBtnText, { fontSize: ms(13) }]}
              numberOfLines={1}
            >
              {isSmallPhone ? 'Scan QR' : 'Scan QR at Barrier'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buyTicketBtn, { height: ms(48) }]}
            activeOpacity={0.88}
            onPress={() => router.push(`/booking/${spot.id}` as any)}
          >
            <Text
              style={[styles.buyTicketBtnText, { fontSize: ms(13.5) }]}
              numberOfLines={1}
            >
              Buy Ticket in App
            </Text>
            <MaterialIcons name="arrow-forward" size={ms(17)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
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
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  heroBox: {
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(11, 37, 69, 0.85)',
    borderRadius: 9999,
  },
  corporateBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  titleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
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
    borderRadius: 6,
  },
  amberTagText: {
    fontWeight: '800',
    color: '#362000',
  },
  rateHighlight: {
    fontWeight: '900',
    color: ParkColors.primary,
  },
  spotTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  spotAddress: {
    color: ParkColors.textMuted,
  },
  capacityContainer: {
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
  },
  capacityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
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
    fontWeight: '700',
    color: ParkColors.primary,
  },
  capacityCount: {
    color: ParkColors.textMuted,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ParkColors.secondary,
    borderRadius: 4,
  },
  capacityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  capacityFooterText: {
    color: ParkColors.textMuted,
    fontWeight: '500',
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  cardHeader: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  tariffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    gap: 8,
  },
  tariffLabel: {
    color: ParkColors.text,
    fontWeight: '500',
    flex: 1,
  },
  tariffValue: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  amenitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  amenitiesGrid: {
    width: '100%',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityText: {
    color: ParkColors.text,
    fontWeight: '500',
    flex: 1,
  },
  stickyFooterOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    ...ParkShadows.sheet,
  },
  stickyFooterInner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  scanQrBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: ParkColors.secondary,
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 10,
  },
  scanQrBtnText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  buyTicketBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    paddingHorizontal: 10,
    ...ParkShadows.md,
  },
  buyTicketBtnText: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
