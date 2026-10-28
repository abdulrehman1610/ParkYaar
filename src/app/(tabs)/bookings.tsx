import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header } from '@/components/Header';
import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';
import { Booking } from '@/types';

type TabFilter = 'upcoming' | 'past' | 'cancelled';

export default function BookingsTabScreen() {
  const router = useRouter();
  const { bookings } = useParkStore();
  const [activeTab, setActiveTab] = useState<TabFilter>('upcoming');
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
        return {
          bg: ParkColors.successLight,
          text: ParkColors.success,
          label: 'Confirmed',
        };
      case 'pending':
        return {
          bg: ParkColors.amberDim,
          text: '#633F00',
          label: 'Pending Approval',
        };
      case 'completed':
        return {
          bg: ParkColors.surfaceHigh,
          text: ParkColors.primary,
          label: 'Completed',
        };
      case 'cancelled':
        return {
          bg: '#FEE2E2',
          text: ParkColors.error,
          label: 'Cancelled',
        };
    }
  };

  const thumbSize = ms(68);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Segmented Filter Control */}
      <View style={styles.filterSectionOuter}>
        <View
          style={[
            styles.filterSection,
            {
              maxWidth: contentMaxWidth,
              paddingHorizontal: hPad,
              paddingVertical: vs(10),
            },
          ]}
        >
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                { paddingVertical: vs(8) },
                activeTab === 'upcoming' && styles.segmentBtnActive,
              ]}
              onPress={() => setActiveTab('upcoming')}
            >
              <Text
                style={[
                  styles.segmentText,
                  { fontSize: ms(12) },
                  activeTab === 'upcoming' && styles.segmentTextActive,
                ]}
                numberOfLines={1}
              >
                Upcoming (
                {
                  bookings.filter(
                    (b) => b.status === 'confirmed' || b.status === 'pending'
                  ).length
                }
                )
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentBtn,
                { paddingVertical: vs(8) },
                activeTab === 'past' && styles.segmentBtnActive,
              ]}
              onPress={() => setActiveTab('past')}
            >
              <Text
                style={[
                  styles.segmentText,
                  { fontSize: ms(12) },
                  activeTab === 'past' && styles.segmentTextActive,
                ]}
                numberOfLines={1}
              >
                Past ({bookings.filter((b) => b.status === 'completed').length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentBtn,
                { paddingVertical: vs(8) },
                activeTab === 'cancelled' && styles.segmentBtnActive,
              ]}
              onPress={() => setActiveTab('cancelled')}
            >
              <Text
                style={[
                  styles.segmentText,
                  { fontSize: ms(12) },
                  activeTab === 'cancelled' && styles.segmentTextActive,
                ]}
                numberOfLines={1}
              >
                Cancelled
              </Text>
            </TouchableOpacity>
          </View>
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
            paddingBottom: tabScrollBottomPad,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredBookings.length === 0 ? (
          <View style={[styles.emptyCard, { padding: s(28) }]}>
            <View
              style={[
                styles.emptyIconCircle,
                {
                  width: ms(60),
                  height: ms(60),
                  borderRadius: ms(30),
                },
              ]}
            >
              <MaterialIcons
                name="confirmation-number"
                size={ms(30)}
                color={ParkColors.textMuted}
              />
            </View>
            <Text style={[styles.emptyTitle, { fontSize: ms(16) }]}>
              No {activeTab} bookings
            </Text>
            <Text style={[styles.emptySubtitle, { fontSize: ms(13) }]}>
              Reserve a verified driveway or commercial bay in Lahore in under
              60 seconds.
            </Text>
            <TouchableOpacity
              style={[
                styles.findSpotBtn,
                {
                  paddingHorizontal: s(20),
                  paddingVertical: vs(11),
                },
              ]}
              onPress={() => router.push('/(tabs)' as any)}
            >
              <Text style={[styles.findSpotBtnText, { fontSize: ms(13) }]}>
                Find Parking Spot
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={[
              styles.cardsGrid,
              {
                gap: vGap,
                flexDirection: isWide ? 'row' : 'column',
                flexWrap: isWide ? 'wrap' : 'nowrap',
              },
            ]}
          >
            {filteredBookings.map((b) => {
              const st = getStatusColor(b.status);
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.bookingCard,
                    { padding: cardPad },
                    isWide && { flexBasis: '48.2%', flexGrow: 1 },
                  ]}
                  activeOpacity={0.88}
                  onPress={() =>
                    router.push(`/booking-confirmed/${b.id}` as any)
                  }
                >
                  <View style={[styles.cardTop, { gap: s(12) }]}>
                    <Image
                      source={{ uri: b.listingPhoto }}
                      style={[
                        styles.cardImage,
                        { width: thumbSize, height: thumbSize },
                      ]}
                    />
                    <View style={styles.cardTopInfo}>
                      <View style={styles.idStatusRow}>
                        <Text style={[styles.bookingId, { fontSize: ms(11) }]}>
                          #{b.id}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: st.bg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              { color: st.text, fontSize: ms(10) },
                            ]}
                          >
                            {st.label}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[styles.cardTitle, { fontSize: ms(15) }]}
                        numberOfLines={1}
                      >
                        {b.listingTitle}
                      </Text>
                      <Text
                        style={[styles.cardArea, { fontSize: ms(12) }]}
                        numberOfLines={1}
                      >
                        {b.listingArea}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[styles.cardDivider, { marginVertical: vs(11) }]}
                  />

                  <View style={styles.cardBottom}>
                    <View style={styles.detailsCol}>
                      <View style={styles.detailRow}>
                        <MaterialIcons
                          name="schedule"
                          size={ms(13)}
                          color={ParkColors.textMuted}
                        />
                        <Text
                          style={[styles.detailText, { fontSize: ms(12) }]}
                          numberOfLines={1}
                        >
                          {b.durationLabel}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <MaterialIcons
                          name="directions-car"
                          size={ms(13)}
                          color={ParkColors.textMuted}
                        />
                        <Text
                          style={[styles.detailText, { fontSize: ms(12) }]}
                          numberOfLines={1}
                        >
                          {b.vehicle.model} • {b.vehicle.plate}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.priceActionCol}>
                      <Text style={[styles.cardPrice, { fontSize: ms(16) }]}>
                        Rs {b.total}
                      </Text>
                      <View style={styles.passBtnPill}>
                        <Text
                          style={[
                            styles.passBtnPillText,
                            { fontSize: ms(11.5) },
                          ]}
                        >
                          View Pass
                        </Text>
                        <MaterialIcons
                          name="chevron-right"
                          size={ms(14)}
                          color={ParkColors.secondary}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
  filterSectionOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
  },
  filterSection: {
    width: '100%',
    alignSelf: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  segmentBtnActive: {
    backgroundColor: ParkColors.secondary,
    ...ParkShadows.sm,
  },
  segmentText: {
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
    width: '100%',
    alignSelf: 'center',
  },
  cardsGrid: {
    width: '100%',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    borderRadius: ParkRadii.md,
    backgroundColor: ParkColors.surfaceHigh,
  },
  cardTopInfo: {
    flex: 1,
    gap: 3,
  },
  idStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  bookingId: {
    fontWeight: '700',
    color: ParkColors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  statusText: {
    fontWeight: '700',
  },
  cardTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  cardArea: {
    color: ParkColors.textMuted,
  },
  cardDivider: {
    height: 1,
    backgroundColor: ParkColors.border,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  detailsCol: {
    gap: 4,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    color: ParkColors.textVariant,
    fontWeight: '500',
    flexShrink: 1,
  },
  priceActionCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardPrice: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  passBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 2,
  },
  passBtnPillText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  emptyIconCircle: {
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  emptySubtitle: {
    color: ParkColors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 20,
    maxWidth: 320,
  },
  findSpotBtn: {
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  findSpotBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
