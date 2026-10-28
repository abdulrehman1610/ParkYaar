import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header } from '@/components/Header';
import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';

export default function HostTabScreen() {
  const router = useRouter();
  const {
    listings,
    bookings,
    updateBookingStatus,
    toggleListingActive,
    user,
  } = useParkStore();

  const {
    s,
    vs,
    ms,
    hPad,
    vGap,
    cardPad,
    tabScrollBottomPad,
    contentMaxWidth,
    isWide,
  } = useResponsive();

  // Host listings (by default Sana Malik's spots or spots created by user)
  const hostListings = listings.filter(
    (l) =>
      l.hostName === user.name ||
      l.id === 'spot-1' ||
      l.id.startsWith('spot-usr')
  );

  // Pending requests from seekers
  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  const weeklyEarnings = [
    { day: 'Mon', amount: 5400, height: 45 },
    { day: 'Tue', amount: 6800, height: 60 },
    { day: 'Wed', amount: 8200, height: 75 },
    { day: 'Thu', amount: 7100, height: 65 },
    { day: 'Fri', amount: 9500, height: 90 },
    { day: 'Sat', amount: 11500, height: 100 },
    { day: 'Sun', amount: 8500, height: 78 },
  ];

  const thumbSize = ms(64);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: contentMaxWidth,
            paddingHorizontal: hPad,
            paddingTop: vGap,
            gap: vGap,
            paddingBottom: tabScrollBottomPad,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Host Welcome Banner */}
        <View style={styles.hostHeaderRow}>
          <View style={styles.hostHeaderLeft}>
            <Text style={[styles.hostGreeting, { fontSize: ms(20) }]}>
              Host Dashboard
            </Text>
            <Text
              style={[styles.hostSub, { fontSize: ms(12) }]}
              numberOfLines={1}
            >
              Welcome back, {user.name} (Superhost)
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.addSpotPill,
              {
                paddingHorizontal: s(13),
                paddingVertical: vs(8),
                gap: s(4),
              },
            ]}
            onPress={() => router.push('/add-listing' as any)}
          >
            <MaterialIcons name="add" size={ms(16)} color="#FFFFFF" />
            <Text style={[styles.addSpotPillText, { fontSize: ms(12) }]}>
              List Spot
            </Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Earnings Card with Mini Bar Chart */}
        <View style={[styles.earningsCard, { padding: s(18) }]}>
          <View style={styles.earningsTop}>
            <View style={{ flexShrink: 1 }}>
              <Text style={[styles.earningsLabel, { fontSize: ms(12) }]}>
                This Month&apos;s Earnings
              </Text>
              <Text style={[styles.earningsAmount, { fontSize: ms(28) }]}>
                Rs 48,500
              </Text>
              <View style={styles.growthBadge}>
                <MaterialIcons
                  name="trending-up"
                  size={ms(14)}
                  color={ParkColors.success}
                />
                <Text style={[styles.growthText, { fontSize: ms(11.5) }]}>
                  +18.4% vs last month
                </Text>
              </View>
            </View>
            <View style={styles.payoutChip}>
              <Text style={[styles.payoutChipText, { fontSize: ms(10.5) }]}>
                JazzCash Auto-Payout
              </Text>
            </View>
          </View>

          {/* Mini Bar Chart */}
          <View
            style={[
              styles.chartContainer,
              { marginTop: vs(16), paddingTop: vs(14) },
            ]}
          >
            <Text style={[styles.chartTitle, { fontSize: ms(11) }]}>
              Weekly Inflow (Lahore Bays)
            </Text>
            <View style={[styles.barsRow, { height: vs(100) }]}>
              {weeklyEarnings.map((bar, idx) => (
                <View key={idx} style={styles.barCol}>
                  <View style={[styles.barTrack, { width: ms(16) }]}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${bar.height}%` },
                        bar.day === 'Sat' && styles.barFillHighlight,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDay, { fontSize: ms(10) }]}>
                    {bar.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { gap: s(10) }]}>
          <View style={[styles.statBox, { padding: s(12) }]}>
            <Text style={[styles.statNumber, { fontSize: ms(20) }]}>38</Text>
            <Text
              style={[styles.statLabel, { fontSize: ms(11) }]}
              numberOfLines={1}
            >
              Total Bookings
            </Text>
          </View>
          <View style={[styles.statBox, { padding: s(12) }]}>
            <Text style={[styles.statNumber, { fontSize: ms(20) }]}>
              {hostListings.length}
            </Text>
            <Text
              style={[styles.statLabel, { fontSize: ms(11) }]}
              numberOfLines={1}
            >
              Active Spaces
            </Text>
          </View>
          <View style={[styles.statBox, { padding: s(12) }]}>
            <View style={styles.ratingStatRow}>
              <MaterialIcons
                name="star"
                size={ms(16)}
                color={ParkColors.amber}
              />
              <Text style={[styles.statNumber, { fontSize: ms(20) }]}>
                4.96
              </Text>
            </View>
            <Text
              style={[styles.statLabel, { fontSize: ms(11) }]}
              numberOfLines={1}
            >
              Host Rating
            </Text>
          </View>
        </View>

        {/* Pending Booking Requests Section */}
        <View style={[styles.section, { gap: vs(10) }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: ms(16) }]}>
              Pending Requests
            </Text>
            <View style={styles.pendingBadge}>
              <Text style={[styles.pendingBadgeText, { fontSize: ms(11) }]}>
                {pendingBookings.length} Requests
              </Text>
            </View>
          </View>

          {pendingBookings.length === 0 ? (
            <View style={[styles.noRequestsCard, { padding: s(20) }]}>
              <MaterialIcons
                name="done-all"
                size={ms(24)}
                color={ParkColors.success}
              />
              <Text style={[styles.noRequestsTitle, { fontSize: ms(14) }]}>
                All requests responded to
              </Text>
              <Text style={[styles.noRequestsSubtitle, { fontSize: ms(12) }]}>
                New driveway reservations will appear here in real time.
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.gridWrap,
                {
                  gap: vGap,
                  flexDirection: isWide ? 'row' : 'column',
                  flexWrap: isWide ? 'wrap' : 'nowrap',
                },
              ]}
            >
              {pendingBookings.map((req) => (
                <View
                  key={req.id}
                  style={[
                    styles.requestCard,
                    { padding: cardPad, gap: vs(10) },
                    isWide && { flexBasis: '48.2%', flexGrow: 1 },
                  ]}
                >
                  <View style={styles.requestTop}>
                    <View style={[styles.requestVehicle, { gap: s(10) }]}>
                      <View
                        style={[
                          styles.requestVehicleIcon,
                          {
                            width: ms(38),
                            height: ms(38),
                            borderRadius: ms(19),
                          },
                        ]}
                      >
                        <MaterialIcons
                          name="directions-car"
                          size={ms(20)}
                          color={ParkColors.secondary}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.requestVehicleModel,
                            { fontSize: ms(14) },
                          ]}
                          numberOfLines={1}
                        >
                          {req.vehicle.model}
                        </Text>
                        <Text
                          style={[
                            styles.requestVehiclePlate,
                            { fontSize: ms(11.5) },
                          ]}
                          numberOfLines={1}
                        >
                          {req.vehicle.plate} • Seeker: Verified
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.requestAmount, { fontSize: ms(16) }]}>
                      Rs {req.total}
                    </Text>
                  </View>

                  <View style={styles.requestTimeRow}>
                    <MaterialIcons
                      name="schedule"
                      size={ms(13)}
                      color={ParkColors.textMuted}
                    />
                    <Text
                      style={[styles.requestTimeText, { fontSize: ms(12) }]}
                    >
                      {req.durationLabel}
                    </Text>
                  </View>

                  {/* Actions: Approve / Decline */}
                  <View style={[styles.requestActionRow, { gap: s(10) }]}>
                    <TouchableOpacity
                      style={[
                        styles.declineBtn,
                        { paddingVertical: vs(9) },
                      ]}
                      onPress={() => updateBookingStatus(req.id, 'cancelled')}
                    >
                      <Text
                        style={[styles.declineBtnText, { fontSize: ms(12.5) }]}
                      >
                        Decline
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.approveBtn,
                        { paddingVertical: vs(9) },
                      ]}
                      onPress={() => updateBookingStatus(req.id, 'confirmed')}
                    >
                      <MaterialIcons
                        name="check"
                        size={ms(15)}
                        color="#FFFFFF"
                      />
                      <Text
                        style={[styles.approveBtnText, { fontSize: ms(12.5) }]}
                      >
                        Approve Request
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* My Listings Section */}
        <View style={[styles.section, { gap: vs(10) }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: ms(16) }]}>
              My Managed Spaces
            </Text>
            <Text style={[styles.activeCountText, { fontSize: ms(12) }]}>
              {hostListings.filter((l) => l.isActive !== false).length} Active
            </Text>
          </View>

          <View
            style={[
              styles.gridWrap,
              {
                gap: vs(10),
                flexDirection: isWide ? 'row' : 'column',
                flexWrap: isWide ? 'wrap' : 'nowrap',
              },
            ]}
          >
            {hostListings.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.listingRowCard,
                  { padding: s(12), gap: s(12) },
                  isWide && { flexBasis: '48.2%', flexGrow: 1 },
                ]}
              >
                <Image
                  source={{ uri: item.photos[0] }}
                  style={[
                    styles.listingThumbnail,
                    { width: thumbSize, height: thumbSize },
                  ]}
                />
                <View style={styles.listingInfo}>
                  <Text
                    style={[styles.listingRowTitle, { fontSize: ms(14) }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.listingRowArea, { fontSize: ms(11.5) }]}
                    numberOfLines={1}
                  >
                    {item.area}
                  </Text>
                  <Text
                    style={[styles.listingRowRate, { fontSize: ms(12) }]}
                    numberOfLines={1}
                  >
                    Rs {item.pricePerHour}/hr • Rs {item.pricePerMonth}/mo
                  </Text>
                </View>
                <View style={styles.toggleWrapper}>
                  <Text style={[styles.toggleLabel, { fontSize: ms(10.5) }]}>
                    {item.isActive !== false ? 'Live' : 'Paused'}
                  </Text>
                  <Switch
                    value={item.isActive !== false}
                    onValueChange={() => toggleListingActive(item.id)}
                    trackColor={{
                      false: ParkColors.border,
                      true: ParkColors.secondary,
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* List Space CTA Banner */}
        <TouchableOpacity
          style={[styles.listSpaceCta, { padding: s(16), gap: s(12) }]}
          activeOpacity={0.88}
          onPress={() => router.push('/add-listing' as any)}
        >
          <View style={[styles.listSpaceCtaLeft, { gap: s(12) }]}>
            <View
              style={[
                styles.listSpaceIconCircle,
                {
                  width: ms(44),
                  height: ms(44),
                  borderRadius: ms(22),
                },
              ]}
            >
              <MaterialIcons
                name="add-business"
                size={ms(22)}
                color="#FFFFFF"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.listSpaceCtaTitle, { fontSize: ms(15) }]}>
                Have an Empty Driveway?
              </Text>
              <Text style={[styles.listSpaceCtaSub, { fontSize: ms(12) }]}>
                Earn up to Rs 25,000/month by listing your Lahore porch.
              </Text>
            </View>
          </View>
          <MaterialIcons
            name="arrow-forward"
            size={ms(20)}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParkColors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  hostHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  hostHeaderLeft: {
    flex: 1,
  },
  hostGreeting: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  hostSub: {
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  addSpotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  addSpotPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  earningsCard: {
    backgroundColor: ParkColors.primary,
    borderRadius: ParkRadii.xl,
    ...ParkShadows.md,
  },
  earningsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
  },
  earningsLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
  earningsAmount: {
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  growthText: {
    color: '#34D399',
    fontWeight: '700',
  },
  payoutChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  payoutChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chartContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  chartTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginBottom: 10,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barCol: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  barTrack: {
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: ParkColors.secondary,
    borderRadius: 6,
  },
  barFillHighlight: {
    backgroundColor: ParkColors.amber,
  },
  barDay: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  statNumber: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  statLabel: {
    color: ParkColors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  ratingStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  pendingBadge: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  pendingBadgeText: {
    fontWeight: '800',
    color: '#523400',
  },
  noRequestsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 4,
  },
  noRequestsTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  noRequestsSubtitle: {
    color: ParkColors.textMuted,
    textAlign: 'center',
  },
  gridWrap: {
    width: '100%',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  requestTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  requestVehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestVehicleIcon: {
    backgroundColor: ParkColors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestVehicleModel: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  requestVehiclePlate: {
    color: ParkColors.textMuted,
  },
  requestAmount: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  requestTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  requestTimeText: {
    color: ParkColors.textVariant,
  },
  requestActionRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  declineBtn: {
    flex: 1,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    fontWeight: '700',
    color: ParkColors.textMuted,
  },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
  },
  approveBtnText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeCountText: {
    color: ParkColors.secondary,
    fontWeight: '700',
  },
  listingRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  listingThumbnail: {
    borderRadius: ParkRadii.md,
    backgroundColor: ParkColors.surfaceHigh,
  },
  listingInfo: {
    flex: 1,
    gap: 2,
  },
  listingRowTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  listingRowArea: {
    color: ParkColors.textMuted,
  },
  listingRowRate: {
    fontWeight: '600',
    color: ParkColors.secondary,
  },
  toggleWrapper: {
    alignItems: 'center',
    gap: 2,
  },
  toggleLabel: {
    fontWeight: '700',
    color: ParkColors.textMuted,
  },
  listSpaceCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.secondary,
    borderRadius: ParkRadii.xl,
    ...ParkShadows.md,
  },
  listSpaceCtaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listSpaceIconCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listSpaceCtaTitle: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  listSpaceCtaSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
});
