import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatModal } from '@/components/ChatModal';
import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';

export default function SpotDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { listings } = useParkStore();

  const spot = listings.find((l) => l.id === id) || listings[0];

  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'hourly' | 'daily' | 'monthly'>('hourly');
  const [chatVisible, setChatVisible] = useState(false);

  const getTierPrice = () => {
    switch (selectedTier) {
      case 'daily':
        return { price: spot.pricePerDay, unit: '/ day' };
      case 'monthly':
        return { price: spot.pricePerMonth, unit: '/ mo' };
      default:
        return { price: spot.pricePerHour, unit: '/ hr' };
    }
  };

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Directions', `Navigating to ${spot.address}`);
    });
  };

  const handleBookNow = () => {
    router.push(`/booking/${spot.id}` as any);
  };

  const currentPrice = getTierPrice();

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={ParkColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spot Details</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsSaved(!isSaved)}
        >
          <MaterialIcons
            name={isSaved ? 'favorite' : 'favorite-border'}
            size={22}
            color={isSaved ? ParkColors.error : ParkColors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Visual Gallery Hero */}
        <View style={styles.heroGallery}>
          <Image
            source={{ uri: spot.photos[currentPhotoIdx] || spot.photos[0] }}
            style={styles.heroImage}
          />
          {/* Top Badges */}
          <View style={styles.heroBadgesTop}>
            {spot.instantBook && (
              <View style={styles.heroBadgePrimary}>
                <MaterialIcons name="bolt" size={13} color="#FFFFFF" />
                <Text style={styles.heroBadgeText}>Instant Book</Text>
              </View>
            )}
            {spot.cctv && (
              <View style={styles.heroBadgeDark}>
                <MaterialIcons name="videocam" size={13} color="#FFFFFF" />
                <Text style={styles.heroBadgeText}>CCTV Monitored</Text>
              </View>
            )}
          </View>

          {/* Bottom Dots & Counter */}
          <View style={styles.heroFooter}>
            <View style={styles.dotsRow}>
              {spot.photos.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dot,
                    currentPhotoIdx === i && styles.dotActive,
                  ]}
                  onPress={() => setCurrentPhotoIdx(i)}
                />
              ))}
            </View>
            <View style={styles.photoCountBadge}>
              <MaterialIcons name="photo-camera" size={13} color={ParkColors.primary} />
              <Text style={styles.photoCountText}>
                {currentPhotoIdx + 1} of {spot.photos.length} photos
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Content Sheet */}
        <View style={styles.contentBody}>
          {/* Title & Tag */}
          <View style={styles.titleSection}>
            <View style={styles.tagRow}>
              <View style={styles.typeBadge}>
                <MaterialIcons name="local-parking" size={13} color={ParkColors.secondary} />
                <Text style={styles.typeBadgeText}>
                  {spot.type === 'public' ? 'Public Facility' : 'Private Driveway'}
                </Text>
              </View>
              <View style={styles.availableBadge}>
                <View style={styles.greenPulse} />
                <Text style={styles.availableText}>Available Now</Text>
              </View>
            </View>

            <Text style={styles.spotTitle}>{spot.title}</Text>
            <View style={styles.addressRow}>
              <MaterialIcons name="place" size={16} color={ParkColors.secondary} />
              <Text style={styles.addressText}>{spot.address}</Text>
            </View>

            {/* Rating Summary Bar */}
            <View style={styles.ratingBar}>
              <View style={styles.ratingScoreRow}>
                <MaterialIcons name="star" size={18} color={ParkColors.amber} />
                <Text style={styles.ratingNumber}>{spot.rating}</Text>
              </View>
              <Text style={styles.ratingReviewCount}>
                ({spot.reviewCount} verified stays)
              </Text>
              <Text style={styles.ratingDot}>•</Text>
              <View style={styles.topRatedBadge}>
                <MaterialIcons name="verified" size={12} color={ParkColors.secondary} />
                <Text style={styles.topRatedText}>Top Rated Space</Text>
              </View>
            </View>
          </View>

          {/* Verified Host Card */}
          <View style={styles.hostCard}>
            <View style={styles.hostTopRow}>
              <View style={styles.hostAvatarGroup}>
                <Image source={{ uri: spot.hostPhoto }} style={styles.hostAvatarLarge} />
                <View style={styles.hostShieldBadge}>
                  <MaterialIcons name="verified-user" size={12} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.hostDetails}>
                <View style={styles.hostNamePill}>
                  <Text style={styles.hostNameLarge}>{spot.hostName}</Text>
                  <View style={styles.hostBadge}>
                    <Text style={styles.hostBadgeText}>Host</Text>
                  </View>
                </View>
                <Text style={styles.hostSubtitle}>CNIC & Physical Address Verified</Text>
              </View>
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => setChatVisible(true)}
              >
                <MaterialIcons name="chat" size={16} color={ParkColors.secondary} />
                <Text style={styles.contactBtnText}>Contact</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.hostStatsGrid}>
              <View style={styles.hostStatItem}>
                <MaterialIcons name="history-toggle-off" size={16} color={ParkColors.textMuted} />
                <View>
                  <Text style={styles.hostStatLabel}>Response Time</Text>
                  <Text style={styles.hostStatValue}>{spot.hostResponseTime}</Text>
                </View>
              </View>
              <View style={styles.hostStatItem}>
                <MaterialIcons name="calendar-month" size={16} color={ParkColors.textMuted} />
                <View>
                  <Text style={styles.hostStatLabel}>Hosting Since</Text>
                  <Text style={styles.hostStatValue}>{spot.hostSince}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Amenities & Security Bento Grid */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Amenities & Security</Text>
              <Text style={styles.sectionSubtitle}>
                {spot.features.length} Verified Features
              </Text>
            </View>

            <View style={styles.amenitiesGrid}>
              {spot.features.map((feature, idx) => (
                <View key={idx} style={styles.amenityTile}>
                  <View style={styles.amenityIconCircle}>
                    <MaterialIcons
                      name={
                        feature.includes('EV')
                          ? 'electric-bolt'
                          : feature.includes('CCTV')
                          ? 'videocam'
                          : feature.includes('Covered')
                          ? 'roofing'
                          : feature.includes('Gated')
                          ? 'lock'
                          : 'directions-car'
                      }
                      size={18}
                      color={ParkColors.secondary}
                    />
                  </View>
                  <Text style={styles.amenityText} numberOfLines={2}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tiered Duration Pricing Selector */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Choose Duration Tier</Text>
              <Text style={styles.sectionSubtitle}>Select to preview total</Text>
            </View>

            <View style={styles.tierGroup}>
              {/* Hourly Tier */}
              <TouchableOpacity
                style={[
                  styles.tierCard,
                  selectedTier === 'hourly' && styles.tierCardSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedTier('hourly')}
              >
                <View style={styles.tierLeft}>
                  <View style={[styles.radioOuter, selectedTier === 'hourly' && styles.radioOuterSelected]}>
                    {selectedTier === 'hourly' && <View style={styles.radioInner} />}
                  </View>
                  <View>
                    <View style={styles.tierBadgeRow}>
                      <Text style={styles.tierTitle}>Hourly Parking</Text>
                      <View style={styles.tierPill}>
                        <Text style={styles.tierPillText}>Standard</Text>
                      </View>
                    </View>
                    <Text style={styles.tierDesc}>Pay-as-you-go • Min 1 hr</Text>
                  </View>
                </View>
                <View style={styles.tierRight}>
                  <Text style={styles.tierPrice}>Rs {spot.pricePerHour}</Text>
                  <Text style={styles.tierUnit}>per hour</Text>
                </View>
              </TouchableOpacity>

              {/* Full Day Pass Tier */}
              <TouchableOpacity
                style={[
                  styles.tierCard,
                  selectedTier === 'daily' && styles.tierCardSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedTier('daily')}
              >
                <View style={styles.tierLeft}>
                  <View style={[styles.radioOuter, selectedTier === 'daily' && styles.radioOuterSelected]}>
                    {selectedTier === 'daily' && <View style={styles.radioInner} />}
                  </View>
                  <View>
                    <View style={styles.tierBadgeRow}>
                      <Text style={styles.tierTitle}>Full Day Pass</Text>
                      <View style={styles.saveBadge}>
                        <Text style={styles.saveBadgeText}>Save 25%</Text>
                      </View>
                    </View>
                    <Text style={styles.tierDesc}>12 hours continuous access</Text>
                  </View>
                </View>
                <View style={styles.tierRight}>
                  <Text style={styles.tierPrice}>Rs {spot.pricePerDay}</Text>
                  <Text style={styles.tierUnit}>per day</Text>
                </View>
              </TouchableOpacity>

              {/* Monthly Tier */}
              <TouchableOpacity
                style={[
                  styles.tierCard,
                  selectedTier === 'monthly' && styles.tierCardSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedTier('monthly')}
              >
                <View style={styles.tierLeft}>
                  <View style={[styles.radioOuter, selectedTier === 'monthly' && styles.radioOuterSelected]}>
                    {selectedTier === 'monthly' && <View style={styles.radioInner} />}
                  </View>
                  <View>
                    <View style={styles.tierBadgeRow}>
                      <Text style={styles.tierTitle}>Monthly Reserved</Text>
                      <View style={styles.tierPill}>
                        <Text style={styles.tierPillText}>Dedicated</Text>
                      </View>
                    </View>
                    <Text style={styles.tierDesc}>Designated 24/7 private bay</Text>
                  </View>
                </View>
                <View style={styles.tierRight}>
                  <Text style={styles.tierPrice}>Rs {spot.pricePerMonth}</Text>
                  <Text style={styles.tierUnit}>per month</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Access Protocol & Instructions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Location & Access Protocol</Text>

            {/* Directions Bar */}
            <View style={styles.directionsBar}>
              <View style={styles.directionsInfo}>
                <View style={styles.directionsIcon}>
                  <MaterialIcons name="navigation" size={18} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.directionsTitle}>4 mins drive from Liberty</Text>
                  <Text style={styles.directionsSubtitle}>Direct asphalt route via Main Blvd</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.directionsBtn}
                onPress={handleDirections}
              >
                <Text style={styles.directionsBtnText}>Get Directions</Text>
              </TouchableOpacity>
            </View>

            {/* Smart Access Instructions Card */}
            <View style={styles.accessProtocolCard}>
              <View style={styles.accessIconCircle}>
                <MaterialIcons name="qr-code-scanner" size={20} color={ParkColors.secondary} />
              </View>
              <View style={styles.accessTextGroup}>
                <Text style={styles.accessTitle}>Automated Driveway Gate</Text>
                <Text style={styles.accessDesc}>{spot.accessProtocol}</Text>
              </View>
            </View>
          </View>

          {/* SafePark Guarantee */}
          <View style={styles.guaranteeBox}>
            <MaterialIcons name="shield" size={20} color={ParkColors.secondary} />
            <Text style={styles.guaranteeText}>
              <Text style={{ fontWeight: '700', color: ParkColors.text }}>
                ParkYaar SafePark Guarantee:{' '}
              </Text>
              Free cancellation up to 15 mins before arrival time. Full host payout protection.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.footerSummary}>
          <View style={styles.footerPriceRow}>
            <Text style={styles.footerPrice}>Rs {currentPrice.price}</Text>
            <Text style={styles.footerUnit}>{currentPrice.unit}</Text>
          </View>
          <View style={styles.feeIncludedRow}>
            <MaterialIcons name="check-circle" size={12} color={ParkColors.secondary} />
            <Text style={styles.feeIncludedText}>Taxes & fee included</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookNowButton}
          activeOpacity={0.88}
          onPress={handleBookNow}
        >
          <Text style={styles.bookNowText}>Book This Spot</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Chat with Host Modal */}
      <ChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        hostName={spot.hostName}
        hostPhoto={spot.hostPhoto}
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
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    zIndex: 20,
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
    paddingBottom: 110,
  },
  heroGallery: {
    width: '100%',
    height: 270,
    position: 'relative',
    backgroundColor: ParkColors.surfaceContainer,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroBadgesTop: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    gap: 6,
  },
  heroBadgePrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  heroBadgeDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  heroFooter: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(11, 37, 69, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  photoCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  photoCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: ParkColors.primary,
  },
  contentBody: {
    padding: 16,
    gap: 18,
  },
  titleSection: {
    gap: 6,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  greenPulse: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: ParkColors.amber,
  },
  availableText: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  spotTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: ParkColors.primary,
    lineHeight: 28,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    fontSize: 13,
    color: ParkColors.textMuted,
    flex: 1,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceLow,
    padding: 10,
    borderRadius: ParkRadii.md,
    gap: 6,
    marginTop: 4,
  },
  ratingScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: ParkColors.text,
  },
  ratingReviewCount: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  ratingDot: {
    color: ParkColors.textMuted,
  },
  topRatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  topRatedText: {
    fontSize: 11,
    fontWeight: '600',
    color: ParkColors.secondary,
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
  hostTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hostAvatarGroup: {
    position: 'relative',
  },
  hostAvatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ParkColors.surfaceHigh,
  },
  hostShieldBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostDetails: {
    flex: 1,
  },
  hostNamePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hostNameLarge: {
    fontSize: 15,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  hostBadge: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hostBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  hostSubtitle: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  contactBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.secondary,
  },
  hostStatsGrid: {
    flexDirection: 'row',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    padding: 10,
    justifyContent: 'space-between',
  },
  hostStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  hostStatLabel: {
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  hostStatValue: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  sectionContainer: {
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
    color: ParkColors.primary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: ParkColors.secondary,
    fontWeight: '600',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.md,
    padding: 10,
    borderWidth: 1,
    borderColor: ParkColors.border,
    width: '48.5%',
    gap: 8,
    ...ParkShadows.sm,
  },
  amenityIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.text,
    flex: 1,
  },
  tierGroup: {
    gap: 10,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  tierCardSelected: {
    borderColor: ParkColors.secondary,
    backgroundColor: ParkColors.surfaceLow,
  },
  tierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ParkColors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: ParkColors.secondary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ParkColors.secondary,
  },
  tierBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  tierPill: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  tierPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: ParkColors.secondary,
  },
  saveBadge: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#291800',
  },
  tierDesc: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  tierRight: {
    alignItems: 'flex-end',
  },
  tierPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  tierUnit: {
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  directionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  directionsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  directionsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.text,
  },
  directionsSubtitle: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
  directionsBtn: {
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ParkRadii.sm,
  },
  directionsBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  accessProtocolCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  accessIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  accessTextGroup: {
    flex: 1,
  },
  accessTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  accessDesc: {
    fontSize: 12,
    color: ParkColors.textVariant,
    lineHeight: 18,
    marginTop: 3,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ParkColors.surfaceLow,
    padding: 12,
    borderRadius: ParkRadii.md,
  },
  guaranteeText: {
    fontSize: 11,
    color: ParkColors.textVariant,
    flex: 1,
    lineHeight: 16,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...ParkShadows.sheet,
  },
  footerSummary: {
    justifyContent: 'center',
  },
  footerPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  footerUnit: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  feeIncludedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  feeIncludedText: {
    fontSize: 11,
    color: ParkColors.secondary,
    fontWeight: '500',
  },
  bookNowButton: {
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ParkShadows.md,
  },
  bookNowText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
