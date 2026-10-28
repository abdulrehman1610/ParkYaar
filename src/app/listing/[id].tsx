import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ChatModal } from '@/components/ChatModal';
import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';

export default function SpotDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings } = useParkStore();
  const {
    height,
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
    isWide,
  } = useResponsive();

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
  const heroHeight = Math.round(Math.min(Math.max(height * 0.32, 210), 340));
  const iconBtnSize = ms(38);

  return (
    <View style={styles.container}>
      {/* Top Header */}
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
            Spot Details
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
            onPress={() => setIsSaved(!isSaved)}
          >
            <MaterialIcons
              name={isSaved ? 'favorite' : 'favorite-border'}
              size={ms(21)}
              color={isSaved ? ParkColors.error : ParkColors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: vs(120) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Visual Gallery Hero */}
        <View style={[styles.heroGallery, { height: heroHeight }]}>
          <Image
            source={{ uri: spot.photos[currentPhotoIdx] || spot.photos[0] }}
            style={styles.heroImage}
          />
          {/* Top Badges */}
          <View style={[styles.heroBadgesTop, { top: s(14), left: hPad, gap: s(6) }]}>
            {spot.instantBook && (
              <View style={[styles.heroBadgePrimary, { paddingHorizontal: s(10), paddingVertical: vs(5) }]}>
                <MaterialIcons name="bolt" size={ms(13)} color="#FFFFFF" />
                <Text style={[styles.heroBadgeText, { fontSize: ms(11) }]}>
                  Instant Book
                </Text>
              </View>
            )}
            {spot.cctv && (
              <View style={[styles.heroBadgeDark, { paddingHorizontal: s(10), paddingVertical: vs(5) }]}>
                <MaterialIcons name="videocam" size={ms(13)} color="#FFFFFF" />
                <Text style={[styles.heroBadgeText, { fontSize: ms(11) }]}>
                  CCTV Monitored
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Dots & Counter */}
          <View style={[styles.heroFooter, { bottom: vs(12), left: hPad, right: hPad }]}>
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
              <MaterialIcons name="photo-camera" size={ms(13)} color={ParkColors.primary} />
              <Text style={[styles.photoCountText, { fontSize: ms(11) }]}>
                {currentPhotoIdx + 1} of {spot.photos.length} photos
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Content Sheet */}
        <View style={styles.contentOuter}>
          <View
            style={[
              styles.contentBody,
              {
                maxWidth: contentMaxWidth,
                paddingHorizontal: hPad,
                paddingTop: vs(18),
                gap: vGap,
              },
            ]}
          >
            {/* Title & Tag */}
            <View style={[styles.titleSection, { gap: vs(6) }]}>
              <View style={styles.tagRow}>
                <View style={styles.typeBadge}>
                  <MaterialIcons
                    name="local-parking"
                    size={ms(13)}
                    color={ParkColors.secondary}
                  />
                  <Text style={[styles.typeBadgeText, { fontSize: ms(11) }]}>
                    {spot.type === 'public' ? 'Public Facility' : 'Private Driveway'}
                  </Text>
                </View>
                <View style={styles.availableBadge}>
                  <View style={styles.greenPulse} />
                  <Text style={[styles.availableText, { fontSize: ms(11) }]}>
                    Available Now
                  </Text>
                </View>
              </View>

              <Text style={[styles.spotTitle, { fontSize: ms(22) }]}>
                {spot.title}
              </Text>
              <View style={styles.addressRow}>
                <MaterialIcons name="place" size={ms(16)} color={ParkColors.secondary} />
                <Text style={[styles.addressText, { fontSize: ms(13) }]}>
                  {spot.address}
                </Text>
              </View>

              {/* Rating Summary Bar */}
              <View style={[styles.ratingBar, { marginTop: vs(4), gap: s(6) }]}>
                <View style={styles.ratingScoreRow}>
                  <MaterialIcons name="star" size={ms(17)} color={ParkColors.amber} />
                  <Text style={[styles.ratingNumber, { fontSize: ms(14) }]}>
                    {spot.rating}
                  </Text>
                </View>
                <Text style={[styles.ratingReviewCount, { fontSize: ms(12) }]}>
                  ({spot.reviewCount} verified stays)
                </Text>
                <Text style={styles.ratingDot}>•</Text>
                <View style={styles.topRatedBadge}>
                  <MaterialIcons name="verified" size={ms(12)} color={ParkColors.secondary} />
                  <Text style={[styles.topRatedText, { fontSize: ms(11) }]}>
                    Top Rated Space
                  </Text>
                </View>
              </View>
            </View>

            {/* Verified Host Card */}
            <View style={[styles.hostCard, { padding: cardPad, gap: vs(12) }]}>
              <View style={[styles.hostTopRow, { gap: s(12) }]}>
                <View style={styles.hostAvatarGroup}>
                  <Image
                    source={{ uri: spot.hostPhoto }}
                    style={[
                      styles.hostAvatarLarge,
                      {
                        width: ms(48),
                        height: ms(48),
                        borderRadius: ms(24),
                      },
                    ]}
                  />
                  <View style={styles.hostShieldBadge}>
                    <MaterialIcons name="verified-user" size={ms(11)} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.hostDetails}>
                  <View style={styles.hostNamePill}>
                    <Text
                      style={[styles.hostNameLarge, { fontSize: ms(15) }]}
                      numberOfLines={1}
                    >
                      {spot.hostName}
                    </Text>
                    <View style={styles.hostBadge}>
                      <Text style={[styles.hostBadgeText, { fontSize: ms(10) }]}>
                        Host
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[styles.hostSubtitle, { fontSize: ms(11.5) }]}
                    numberOfLines={1}
                  >
                    CNIC & Physical Address Verified
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.contactBtn,
                    { paddingHorizontal: s(12), paddingVertical: vs(7) },
                  ]}
                  onPress={() => setChatVisible(true)}
                >
                  <MaterialIcons name="chat" size={ms(15)} color={ParkColors.secondary} />
                  <Text style={[styles.contactBtnText, { fontSize: ms(12) }]}>
                    Contact
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.hostStatsGrid, { paddingTop: vs(10), gap: s(10) }]}>
                <View style={[styles.hostStatItem, { gap: s(8) }]}>
                  <MaterialIcons
                    name="history-toggle-off"
                    size={ms(16)}
                    color={ParkColors.textMuted}
                  />
                  <View>
                    <Text style={[styles.hostStatLabel, { fontSize: ms(10.5) }]}>
                      Response Time
                    </Text>
                    <Text style={[styles.hostStatValue, { fontSize: ms(12.5) }]}>
                      {spot.hostResponseTime}
                    </Text>
                  </View>
                </View>
                <View style={[styles.hostStatItem, { gap: s(8) }]}>
                  <MaterialIcons
                    name="calendar-month"
                    size={ms(16)}
                    color={ParkColors.textMuted}
                  />
                  <View>
                    <Text style={[styles.hostStatLabel, { fontSize: ms(10.5) }]}>
                      Hosting Since
                    </Text>
                    <Text style={[styles.hostStatValue, { fontSize: ms(12.5) }]}>
                      {spot.hostSince}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Amenities & Security Bento Grid */}
            <View style={[styles.sectionContainer, { gap: vs(10) }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { fontSize: ms(16) }]}>
                  Amenities & Security
                </Text>
                <Text style={[styles.sectionSubtitle, { fontSize: ms(12) }]}>
                  {spot.features.length} Verified Features
                </Text>
              </View>

              <View style={[styles.amenitiesGrid, { gap: s(10) }]}>
                {spot.features.map((feature, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.amenityTile,
                      {
                        padding: s(12),
                        gap: s(10),
                        flexBasis: isWide ? '23%' : '47%',
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.amenityIconCircle,
                        {
                          width: ms(34),
                          height: ms(34),
                          borderRadius: ms(17),
                        },
                      ]}
                    >
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
                        size={ms(17)}
                        color={ParkColors.secondary}
                      />
                    </View>
                    <Text
                      style={[styles.amenityText, { fontSize: ms(12) }]}
                      numberOfLines={2}
                    >
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tiered Duration Pricing Selector */}
            <View style={[styles.sectionContainer, { gap: vs(10) }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { fontSize: ms(16) }]}>
                  Choose Duration Tier
                </Text>
                <Text style={[styles.sectionSubtitle, { fontSize: ms(12) }]}>
                  Select to preview total
                </Text>
              </View>

              <View style={[styles.tierGroup, { gap: vs(10) }]}>
                {/* Hourly Tier */}
                <TouchableOpacity
                  style={[
                    styles.tierCard,
                    { padding: cardPad },
                    selectedTier === 'hourly' && styles.tierCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTier('hourly')}
                >
                  <View style={[styles.tierLeft, { gap: s(12) }]}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedTier === 'hourly' && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedTier === 'hourly' && <View style={styles.radioInner} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.tierBadgeRow}>
                        <Text style={[styles.tierTitle, { fontSize: ms(14) }]}>
                          Hourly Parking
                        </Text>
                        <View style={styles.tierPill}>
                          <Text style={[styles.tierPillText, { fontSize: ms(10) }]}>
                            Standard
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.tierDesc, { fontSize: ms(11.5) }]}>
                        Pay-as-you-go • Min 1 hr
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tierRight}>
                    <Text style={[styles.tierPrice, { fontSize: ms(16) }]}>
                      Rs {spot.pricePerHour}
                    </Text>
                    <Text style={[styles.tierUnit, { fontSize: ms(11) }]}>
                      per hour
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Full Day Pass Tier */}
                <TouchableOpacity
                  style={[
                    styles.tierCard,
                    { padding: cardPad },
                    selectedTier === 'daily' && styles.tierCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTier('daily')}
                >
                  <View style={[styles.tierLeft, { gap: s(12) }]}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedTier === 'daily' && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedTier === 'daily' && <View style={styles.radioInner} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.tierBadgeRow}>
                        <Text style={[styles.tierTitle, { fontSize: ms(14) }]}>
                          Full Day Pass
                        </Text>
                        <View style={styles.saveBadge}>
                          <Text style={[styles.saveBadgeText, { fontSize: ms(10) }]}>
                            Save 25%
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.tierDesc, { fontSize: ms(11.5) }]}>
                        12 hours continuous access
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tierRight}>
                    <Text style={[styles.tierPrice, { fontSize: ms(16) }]}>
                      Rs {spot.pricePerDay}
                    </Text>
                    <Text style={[styles.tierUnit, { fontSize: ms(11) }]}>
                      per day
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Monthly Tier */}
                <TouchableOpacity
                  style={[
                    styles.tierCard,
                    { padding: cardPad },
                    selectedTier === 'monthly' && styles.tierCardSelected,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTier('monthly')}
                >
                  <View style={[styles.tierLeft, { gap: s(12) }]}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedTier === 'monthly' && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedTier === 'monthly' && <View style={styles.radioInner} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.tierBadgeRow}>
                        <Text style={[styles.tierTitle, { fontSize: ms(14) }]}>
                          Monthly Reserved
                        </Text>
                        <View style={styles.tierPill}>
                          <Text style={[styles.tierPillText, { fontSize: ms(10) }]}>
                            Dedicated
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.tierDesc, { fontSize: ms(11.5) }]}>
                        Designated 24/7 private bay
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tierRight}>
                    <Text style={[styles.tierPrice, { fontSize: ms(16) }]}>
                      Rs {spot.pricePerMonth}
                    </Text>
                    <Text style={[styles.tierUnit, { fontSize: ms(11) }]}>
                      per month
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Access Protocol & Instructions */}
            <View style={[styles.sectionContainer, { gap: vs(10) }]}>
              <Text style={[styles.sectionTitle, { fontSize: ms(16) }]}>
                Location & Access Protocol
              </Text>

              {/* Directions Bar */}
              <View style={[styles.directionsBar, { padding: cardPad, gap: s(10) }]}>
                <View style={[styles.directionsInfo, { gap: s(10) }]}>
                  <View
                    style={[
                      styles.directionsIcon,
                      {
                        width: ms(36),
                        height: ms(36),
                        borderRadius: ms(18),
                      },
                    ]}
                  >
                    <MaterialIcons name="navigation" size={ms(17)} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.directionsTitle, { fontSize: ms(13.5) }]}>
                      4 mins drive from Liberty
                    </Text>
                    <Text style={[styles.directionsSubtitle, { fontSize: ms(11.5) }]}>
                      Direct asphalt route via Main Blvd
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.directionsBtn,
                    { paddingHorizontal: s(12), paddingVertical: vs(7) },
                  ]}
                  onPress={handleDirections}
                >
                  <Text style={[styles.directionsBtnText, { fontSize: ms(12) }]}>
                    Get Directions
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Smart Access Instructions Card */}
              <View style={[styles.accessProtocolCard, { padding: cardPad, gap: s(12) }]}>
                <View
                  style={[
                    styles.accessIconCircle,
                    {
                      width: ms(40),
                      height: ms(40),
                      borderRadius: ms(20),
                    },
                  ]}
                >
                  <MaterialIcons
                    name="qr-code-scanner"
                    size={ms(20)}
                    color={ParkColors.secondary}
                  />
                </View>
                <View style={styles.accessTextGroup}>
                  <Text style={[styles.accessTitle, { fontSize: ms(13.5) }]}>
                    Automated Driveway Gate
                  </Text>
                  <Text style={[styles.accessDesc, { fontSize: ms(12) }]}>
                    {spot.accessProtocol}
                  </Text>
                </View>
              </View>
            </View>

            {/* SafePark Guarantee */}
            <View style={[styles.guaranteeBox, { padding: cardPad, gap: s(10) }]}>
              <MaterialIcons name="shield" size={ms(20)} color={ParkColors.secondary} />
              <Text style={[styles.guaranteeText, { fontSize: ms(12) }]}>
                <Text style={{ fontWeight: '700', color: ParkColors.text }}>
                  ParkYaar SafePark Guarantee:{' '}
                </Text>
                Free cancellation up to 15 mins before arrival time. Full host payout protection.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
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
        <View style={[styles.stickyFooterInner, { maxWidth: contentMaxWidth }]}>
          <View style={styles.footerSummary}>
            <View style={styles.footerPriceRow}>
              <Text style={[styles.footerPrice, { fontSize: ms(20) }]}>
                Rs {currentPrice.price}
              </Text>
              <Text style={[styles.footerUnit, { fontSize: ms(12) }]}>
                {currentPrice.unit}
              </Text>
            </View>
            <View style={styles.feeIncludedRow}>
              <MaterialIcons
                name="check-circle"
                size={ms(12)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.feeIncludedText, { fontSize: ms(11) }]}>
                Taxes & fee included
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.bookNowButton,
              {
                height: ms(48),
                paddingHorizontal: s(22),
              },
            ]}
            activeOpacity={0.88}
            onPress={handleBookNow}
          >
            <Text style={[styles.bookNowText, { fontSize: ms(15) }]}>
              Book This Spot
            </Text>
            <MaterialIcons name="arrow-forward" size={ms(19)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
  headerOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    zIndex: 20,
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
    flexGrow: 1,
  },
  heroGallery: {
    width: '100%',
    position: 'relative',
    backgroundColor: ParkColors.surfaceContainer,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroBadgesTop: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  heroBadgePrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  heroBadgeDark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.primary,
    borderRadius: 9999,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroFooter: {
    position: 'absolute',
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
    paddingVertical: 6,
    borderRadius: 9999,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
  photoCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  photoCountText: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  contentOuter: {
    width: '100%',
    backgroundColor: ParkColors.background,
    borderTopLeftRadius: ParkRadii.sheet,
    borderTopRightRadius: ParkRadii.sheet,
    marginTop: -16,
  },
  contentBody: {
    width: '100%',
    alignSelf: 'center',
  },
  titleSection: {
    width: '100%',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  typeBadgeText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: ParkColors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  greenPulse: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: ParkColors.success,
  },
  availableText: {
    fontWeight: '700',
    color: ParkColors.success,
  },
  spotTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
    letterSpacing: -0.3,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addressText: {
    color: ParkColors.textMuted,
    flex: 1,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingNumber: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  ratingReviewCount: {
    color: ParkColors.textMuted,
  },
  ratingDot: {
    color: ParkColors.textMuted,
  },
  topRatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  topRatedText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  hostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  hostTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostAvatarGroup: {
    position: 'relative',
  },
  hostAvatarLarge: {
    backgroundColor: ParkColors.surfaceHigh,
  },
  hostShieldBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: ParkColors.secondary,
    borderRadius: 10,
    padding: 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  hostDetails: {
    flex: 1,
    gap: 2,
  },
  hostNamePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hostNameLarge: {
    fontWeight: '700',
    color: ParkColors.primary,
    flexShrink: 1,
  },
  hostBadge: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hostBadgeText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  hostSubtitle: {
    color: ParkColors.textMuted,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  contactBtnText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  hostStatsGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
  },
  hostStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hostStatLabel: {
    color: ParkColors.textMuted,
  },
  hostStatValue: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  sectionContainer: {
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
  sectionSubtitle: {
    color: ParkColors.textMuted,
    fontWeight: '600',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTile: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  amenityIconCircle: {
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityText: {
    flex: 1,
    fontWeight: '600',
    color: ParkColors.text,
  },
  tierGroup: {
    width: '100%',
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
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
    flexWrap: 'wrap',
  },
  tierTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  tierPill: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  tierPillText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  saveBadge: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  saveBadgeText: {
    fontWeight: '800',
    color: '#523400',
  },
  tierDesc: {
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  tierRight: {
    alignItems: 'flex-end',
  },
  tierPrice: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  tierUnit: {
    color: ParkColors.textMuted,
  },
  directionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.primary,
    borderRadius: ParkRadii.lg,
    ...ParkShadows.sm,
  },
  directionsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  directionsIcon: {
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsTitle: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  directionsSubtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 1,
  },
  directionsBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 9999,
  },
  directionsBtnText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  accessProtocolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  accessIconCircle: {
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessTextGroup: {
    flex: 1,
    gap: 2,
  },
  accessTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  accessDesc: {
    color: ParkColors.textMuted,
    lineHeight: 17,
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  guaranteeText: {
    flex: 1,
    color: ParkColors.textMuted,
    lineHeight: 17,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  footerSummary: {
    gap: 2,
  },
  footerPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  footerPrice: {
    fontWeight: '900',
    color: ParkColors.primary,
  },
  footerUnit: {
    color: ParkColors.textMuted,
    fontWeight: '600',
  },
  feeIncludedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feeIncludedText: {
    color: ParkColors.textMuted,
    fontWeight: '500',
  },
  bookNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
    ...ParkShadows.md,
  },
  bookNowText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
