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

  // Host listings (by default Sana Malik's spots or spots created by user)
  const hostListings = listings.filter(
    (l) => l.hostName === user.name || l.id === 'spot-1' || l.id.startsWith('spot-usr')
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

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Host Welcome Banner */}
        <View style={styles.hostHeaderRow}>
          <View>
            <Text style={styles.hostGreeting}>Host Dashboard</Text>
            <Text style={styles.hostSub}>Welcome back, {user.name} (Superhost)</Text>
          </View>
          <TouchableOpacity
            style={styles.addSpotPill}
            onPress={() => router.push('/add-listing' as any)}
          >
            <MaterialIcons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addSpotPillText}>List Spot</Text>
          </TouchableOpacity>
        </View>

        {/* Monthly Earnings Card with Mini Bar Chart */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsTop}>
            <View>
              <Text style={styles.earningsLabel}>This Month's Earnings</Text>
              <Text style={styles.earningsAmount}>Rs 48,500</Text>
              <View style={styles.growthBadge}>
                <MaterialIcons name="trending-up" size={14} color={ParkColors.success} />
                <Text style={styles.growthText}>+18.4% vs last month</Text>
              </View>
            </View>
            <View style={styles.payoutChip}>
              <Text style={styles.payoutChipText}>JazzCash Auto-Payout</Text>
            </View>
          </View>

          {/* Mini Bar Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Weekly Inflow (Lahore Bays)</Text>
            <View style={styles.barsRow}>
              {weeklyEarnings.map((bar, idx) => (
                <View key={idx} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${bar.height}%` },
                        bar.day === 'Sat' && styles.barFillHighlight,
                      ]}
                    />
                  </View>
                  <Text style={styles.barDay}>{bar.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>38</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{hostListings.length}</Text>
            <Text style={styles.statLabel}>Active Spaces</Text>
          </View>
          <View style={styles.statBox}>
            <View style={styles.ratingStatRow}>
              <MaterialIcons name="star" size={16} color={ParkColors.amber} />
              <Text style={styles.statNumber}>4.96</Text>
            </View>
            <Text style={styles.statLabel}>Host Rating</Text>
          </View>
        </View>

        {/* Pending Booking Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>
                {pendingBookings.length} Requests
              </Text>
            </View>
          </View>

          {pendingBookings.length === 0 ? (
            <View style={styles.noRequestsCard}>
              <MaterialIcons name="done-all" size={24} color={ParkColors.success} />
              <Text style={styles.noRequestsTitle}>All requests responded to</Text>
              <Text style={styles.noRequestsSubtitle}>
                New driveway reservations will appear here in real time.
              </Text>
            </View>
          ) : (
            pendingBookings.map((req) => (
              <View key={req.id} style={styles.requestCard}>
                <View style={styles.requestTop}>
                  <View style={styles.requestVehicle}>
                    <View style={styles.requestVehicleIcon}>
                      <MaterialIcons name="directions-car" size={20} color={ParkColors.secondary} />
                    </View>
                    <View>
                      <Text style={styles.requestVehicleModel}>
                        {req.vehicle.model}
                      </Text>
                      <Text style={styles.requestVehiclePlate}>
                        {req.vehicle.plate} • Seeker: Verified
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.requestAmount}>Rs {req.total}</Text>
                </View>

                <View style={styles.requestTimeRow}>
                  <MaterialIcons name="schedule" size={13} color={ParkColors.textMuted} />
                  <Text style={styles.requestTimeText}>{req.durationLabel}</Text>
                </View>

                {/* Actions: Approve / Decline */}
                <View style={styles.requestActionRow}>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={() => updateBookingStatus(req.id, 'cancelled')}
                  >
                    <Text style={styles.declineBtnText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => updateBookingStatus(req.id, 'confirmed')}
                  >
                    <MaterialIcons name="check" size={16} color="#FFFFFF" />
                    <Text style={styles.approveBtnText}>Approve Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* My Listings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Managed Spaces</Text>
            <Text style={styles.activeCountText}>
              {hostListings.filter((l) => l.isActive !== false).length} Active
            </Text>
          </View>

          <View style={styles.listingsStack}>
            {hostListings.map((item) => (
              <View key={item.id} style={styles.listingRowCard}>
                <Image source={{ uri: item.photos[0] }} style={styles.listingThumbnail} />
                <View style={styles.listingInfo}>
                  <Text style={styles.listingRowTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.listingRowArea}>{item.area}</Text>
                  <Text style={styles.listingRowRate}>
                    Rs {item.pricePerHour}/hr • Rs {item.pricePerMonth}/mo
                  </Text>
                </View>
                <View style={styles.toggleWrapper}>
                  <Text style={styles.toggleLabel}>
                    {item.isActive !== false ? 'Live' : 'Paused'}
                  </Text>
                  <Switch
                    value={item.isActive !== false}
                    onValueChange={() => toggleListingActive(item.id)}
                    trackColor={{ false: ParkColors.border, true: ParkColors.secondary }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* List Space CTA Banner */}
        <TouchableOpacity
          style={styles.listSpaceCta}
          activeOpacity={0.88}
          onPress={() => router.push('/add-listing' as any)}
        >
          <View style={styles.listSpaceCtaLeft}>
            <View style={styles.listSpaceIconCircle}>
              <MaterialIcons name="add-business" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.listSpaceCtaTitle}>Have an Empty Driveway?</Text>
              <Text style={styles.listSpaceCtaSub}>
                Earn up to Rs 25,000/month by listing your Lahore porch.
              </Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward" size={22} color="#FFFFFF" />
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
    padding: 16,
    gap: 16,
    paddingBottom: 120,
  },
  hostHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hostGreeting: {
    fontSize: 20,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  hostSub: {
    fontSize: 12,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  addSpotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  addSpotPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 16,
    ...ParkShadows.md,
  },
  earningsTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  earningsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.textMuted,
  },
  earningsAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: ParkColors.primary,
    marginTop: 2,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  growthText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.success,
  },
  payoutChip: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  payoutChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  chartContainer: {
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    paddingTop: 12,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.textMuted,
    marginBottom: 10,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 90,
  },
  barCol: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  barTrack: {
    width: 14,
    height: 70,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: ParkColors.primary,
    borderRadius: 7,
  },
  barFillHighlight: {
    backgroundColor: ParkColors.secondary,
  },
  barDay: {
    fontSize: 10,
    fontWeight: '600',
    color: ParkColors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: ParkColors.primary,
  },
  ratingStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statLabel: {
    fontSize: 10,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ParkColors.text,
  },
  pendingBadge: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#633F00',
  },
  activeCountText: {
    fontSize: 12,
    color: ParkColors.secondary,
    fontWeight: '600',
  },
  noRequestsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 6,
  },
  noRequestsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  noRequestsSubtitle: {
    fontSize: 11,
    color: ParkColors.textMuted,
    textAlign: 'center',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: ParkColors.amberDim,
    gap: 10,
    ...ParkShadows.sm,
  },
  requestTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requestVehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requestVehicleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestVehicleModel: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.text,
  },
  requestVehiclePlate: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
  requestAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: ParkColors.primary,
  },
  requestTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestTimeText: {
    fontSize: 11,
    color: ParkColors.textVariant,
  },
  requestActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  declineBtn: {
    flex: 1,
    height: 40,
    borderRadius: 9999,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.textMuted,
  },
  approveBtn: {
    flex: 2,
    height: 40,
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listingsStack: {
    gap: 10,
  },
  listingRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 10,
    ...ParkShadows.sm,
  },
  listingThumbnail: {
    width: 60,
    height: 60,
    borderRadius: ParkRadii.md,
    backgroundColor: ParkColors.surfaceHigh,
  },
  listingInfo: {
    flex: 1,
  },
  listingRowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.text,
  },
  listingRowArea: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
  listingRowRate: {
    fontSize: 11,
    fontWeight: '600',
    color: ParkColors.secondary,
    marginTop: 2,
  },
  toggleWrapper: {
    alignItems: 'center',
    gap: 2,
  },
  toggleLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: ParkColors.textMuted,
  },
  listSpaceCta: {
    backgroundColor: ParkColors.primary,
    borderRadius: ParkRadii.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    ...ParkShadows.md,
  },
  listSpaceCtaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  listSpaceIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listSpaceCtaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  listSpaceCtaSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
    lineHeight: 15,
  },
});

