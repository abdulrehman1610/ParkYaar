import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header } from '@/components/Header';
import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';
import { Booking } from '@/types';

type TabFilter = 'upcoming' | 'past' | 'cancelled';

export default function BookingsTabScreen() {
  const router = useRouter();
  const { bookings } = useParkStore();
  const [activeTab, setActiveTab] = useState<TabFilter>('upcoming');

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return b.status === 'confirmed' || b.status === 'pending';
    }
    if (activeTab === 'past') {
      return b.status === 'completed';
    }
    return b.status === 'cancelled';
  });

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { bg: ParkColors.successLight, text: ParkColors.success, label: 'Confirmed' };
      case 'pending':
        return { bg: ParkColors.amberDim, text: '#633F00', label: 'Pending Approval' };
      case 'completed':
        return { bg: ParkColors.surfaceHigh, text: ParkColors.primary, label: 'Completed' };
      case 'cancelled':
        return { bg: '#FEE2E2', text: ParkColors.error, label: 'Cancelled' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Segmented Filter Control */}
      <View style={styles.filterSection}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === 'upcoming' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'upcoming' && styles.segmentTextActive,
              ]}
            >
              Upcoming ({bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === 'past' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveTab('past')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'past' && styles.segmentTextActive,
              ]}
            >
              Past ({bookings.filter((b) => b.status === 'completed').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === 'cancelled' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveTab('cancelled')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'cancelled' && styles.segmentTextActive,
              ]}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="confirmation-number" size={32} color={ParkColors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab} bookings</Text>
            <Text style={styles.emptySubtitle}>
              Reserve a verified driveway or commercial bay in Lahore in under 60 seconds.
            </Text>
            <TouchableOpacity
              style={styles.findSpotBtn}
              onPress={() => router.push('/(tabs)' as any)}
            >
              <Text style={styles.findSpotBtnText}>Find Parking Spot</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredBookings.map((b) => {
            const st = getStatusColor(b.status);
            return (
              <TouchableOpacity
                key={b.id}
                style={styles.bookingCard}
                activeOpacity={0.88}
                onPress={() => router.push(`/booking-confirmed/${b.id}` as any)}
              >
                <View style={styles.cardTop}>
                  <Image source={{ uri: b.listingPhoto }} style={styles.cardImage} />
                  <View style={styles.cardTopInfo}>
                    <View style={styles.idStatusRow}>
                      <Text style={styles.bookingId}>#{b.id}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                        <Text style={[styles.statusText, { color: st.text }]}>
                          {st.label}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {b.listingTitle}
                    </Text>
                    <Text style={styles.cardArea}>{b.listingArea}</Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBottom}>
                  <View style={styles.detailsCol}>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="schedule" size={13} color={ParkColors.textMuted} />
                      <Text style={styles.detailText}>{b.durationLabel}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="directions-car" size={13} color={ParkColors.textMuted} />
                      <Text style={styles.detailText}>
                        {b.vehicle.model} • {b.vehicle.plate}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.priceActionCol}>
                    <Text style={styles.cardPrice}>Rs {b.total}</Text>
                    <View style={styles.passBtnPill}>
                      <Text style={styles.passBtnPillText}>View Pass</Text>
                      <MaterialIcons name="chevron-right" size={14} color={ParkColors.secondary} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParkColors.background,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: ParkColors.secondary,
    ...ParkShadows.sm,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.textMuted,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 120,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: ParkRadii.md,
    backgroundColor: ParkColors.surfaceHigh,
  },
  cardTopInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  idStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bookingId: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  cardArea: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: ParkColors.border,
    marginVertical: 10,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsCol: {
    gap: 4,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 11,
    color: ParkColors.textVariant,
  },
  priceActionCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  passBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  passBtnPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ParkColors.border,
    marginTop: 20,
    ...ParkShadows.sm,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ParkColors.text,
  },
  emptySubtitle: {
    fontSize: 12,
    color: ParkColors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 240,
  },
  findSpotBtn: {
    marginTop: 20,
    backgroundColor: ParkColors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  findSpotBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
