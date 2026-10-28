import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  featured = false,
  style,
}) => {
  const router = useRouter();
  const { s, vs, ms, isSmallPhone } = useResponsive();

  const handlePress = () => {
    if (listing.type === 'public') {
      router.push(`/public-spot/${listing.id}` as any);
    } else {
      router.push(`/listing/${listing.id}` as any);
    }
  };

  if (featured) {
    return (
      <TouchableOpacity
        style={[styles.featuredCard, { padding: s(10) }, style]}
        activeOpacity={0.92}
        onPress={handlePress}
      >
        {/* Hero Image Container */}
        <View
          style={[
            styles.featuredImageWrapper,
            { height: isSmallPhone ? vs(155) : vs(178) },
          ]}
        >
          <Image
            source={{ uri: listing.photos[0] }}
            style={styles.featuredImage}
          />
          {/* Top Badges */}
          <View style={[styles.featuredBadgesTop, { top: s(10), left: s(10), gap: s(6) }]}>
            {listing.instantBook && (
              <View style={[styles.instantBookBadge, { paddingHorizontal: s(9), paddingVertical: vs(4) }]}>
                <MaterialIcons name="bolt" size={ms(13)} color="#FFFFFF" />
                <Text style={[styles.instantBookText, { fontSize: ms(11) }]}>
                  Instant Book
                </Text>
              </View>
            )}
            {listing.isCovered && (
              <View style={[styles.coveredBadge, { paddingHorizontal: s(8), paddingVertical: vs(4) }]}>
                <Text style={[styles.coveredText, { fontSize: ms(11) }]}>
                  Covered
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Right Price Pill */}
          <View
            style={[
              styles.pricePill,
              {
                bottom: s(10),
                right: s(10),
                paddingHorizontal: s(10),
                paddingVertical: vs(5),
              },
            ]}
          >
            <Text style={[styles.pricePillFigure, { fontSize: ms(17) }]}>
              Rs {listing.pricePerHour}
            </Text>
            <Text style={[styles.pricePillUnit, { fontSize: ms(11) }]}>/hr</Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={[styles.featuredBody, { paddingTop: vs(10), gap: vs(4) }]}>
          <View style={[styles.titleRatingRow, { gap: s(8) }]}>
            <Text
              style={[styles.featuredTitle, { fontSize: ms(15.5) }]}
              numberOfLines={1}
            >
              {listing.title}
            </Text>
            <View style={[styles.ratingBadge, { paddingHorizontal: s(7), paddingVertical: vs(3) }]}>
              <MaterialIcons name="star" size={ms(13)} color={ParkColors.amber} />
              <Text style={[styles.ratingScore, { fontSize: ms(12) }]}>
                {listing.rating}
              </Text>
              <Text style={[styles.ratingCount, { fontSize: ms(10.5) }]}>
                ({listing.reviewCount})
              </Text>
            </View>
          </View>

          {/* Distance & Walking */}
          <View style={[styles.distanceRow, { gap: s(4) }]}>
            <MaterialIcons name="near-me" size={ms(13)} color={ParkColors.secondary} />
            <Text style={[styles.distanceTextBold, { fontSize: ms(12) }]}>
              {listing.distance}
            </Text>
            <Text style={[styles.distanceDot, { fontSize: ms(12) }]}>•</Text>
            <Text
              style={[styles.distanceText, { fontSize: ms(12) }]}
              numberOfLines={1}
            >
              {listing.walkTime}
            </Text>
          </View>

          {/* Host Credential Bar */}
          <View
            style={[
              styles.hostCredentialBar,
              { padding: s(8), marginTop: vs(5), gap: s(8) },
            ]}
          >
            <View style={[styles.hostInfo, { gap: s(8) }]}>
              <View style={styles.hostAvatarWrapper}>
                <Image
                  source={{ uri: listing.hostPhoto }}
                  style={[
                    styles.hostAvatar,
                    {
                      width: ms(28),
                      height: ms(28),
                      borderRadius: ms(14),
                    },
                  ]}
                />
                {listing.hostVerified && (
                  <View style={styles.hostVerifiedDot}>
                    <MaterialIcons
                      name="verified"
                      size={ms(11)}
                      color={ParkColors.secondary}
                    />
                  </View>
                )}
              </View>
              <View style={styles.hostTextCol}>
                <Text
                  style={[styles.hostName, { fontSize: ms(12) }]}
                  numberOfLines={1}
                >
                  {listing.hostName}
                </Text>
                <Text
                  style={[styles.hostVerifiedLabel, { fontSize: ms(10) }]}
                  numberOfLines={1}
                >
                  {listing.type === 'public'
                    ? 'Official Facility'
                    : 'CNIC Verified Host'}
                </Text>
              </View>
            </View>

            {/* CTA Pill */}
            <View
              style={[
                styles.reserveButton,
                {
                  paddingHorizontal: isSmallPhone ? 9 : s(12),
                  paddingVertical: vs(7),
                },
              ]}
            >
              <Text style={[styles.reserveButtonText, { fontSize: ms(11.5) }]}>
                Reserve Bay
              </Text>
              <MaterialIcons name="chevron-right" size={ms(15)} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Compact Card Variant
  const thumbSize = isSmallPhone ? 88 : ms(98);

  return (
    <TouchableOpacity
      style={[
        styles.compactCard,
        { padding: s(10), gap: s(11) },
        style,
      ]}
      activeOpacity={0.88}
      onPress={handlePress}
    >
      <View
        style={[
          styles.compactImageWrapper,
          { width: thumbSize, height: thumbSize },
        ]}
      >
        <Image
          source={{ uri: listing.photos[0] }}
          style={styles.compactImage}
        />
        <View style={styles.compactCoveredTag}>
          <Text style={[styles.compactTagText, { fontSize: ms(9.5) }]}>
            {listing.isCovered ? 'Covered' : 'Paved'}
          </Text>
        </View>
      </View>

      <View style={[styles.compactContent, { minHeight: thumbSize - 4 }]}>
        <View style={styles.compactTopRow}>
          <View style={styles.compactSecurityTag}>
            <MaterialIcons
              name={listing.cctv ? 'videocam' : 'verified-user'}
              size={ms(12)}
              color={ParkColors.secondary}
            />
            <Text style={[styles.compactSecurityText, { fontSize: ms(11) }]}>
              {listing.cctv ? '24/7 CCTV' : 'Secured'}
            </Text>
          </View>
          <Text style={[styles.compactPrice, { fontSize: ms(15.5) }]}>
            Rs {listing.pricePerHour}
            <Text style={[styles.compactPriceUnit, { fontSize: ms(10.5) }]}>
              /hr
            </Text>
          </Text>
        </View>

        <Text
          style={[styles.compactTitle, { fontSize: ms(14) }]}
          numberOfLines={1}
        >
          {listing.title}
        </Text>
        <Text
          style={[styles.compactAddress, { fontSize: ms(11) }]}
          numberOfLines={1}
        >
          {listing.distance} • {listing.area}
        </Text>

        <View style={styles.compactBottomRow}>
          <View style={[styles.compactHost, { gap: s(4) }]}>
            <Image
              source={{ uri: listing.hostPhoto }}
              style={[
                styles.compactHostAvatar,
                {
                  width: ms(20),
                  height: ms(20),
                  borderRadius: ms(10),
                },
              ]}
            />
            <Text
              style={[styles.compactHostName, { fontSize: ms(11) }]}
              numberOfLines={1}
            >
              {listing.hostName}
            </Text>
            {listing.hostVerified && (
              <MaterialIcons
                name="verified"
                size={ms(12)}
                color={ParkColors.secondary}
              />
            )}
          </View>
          <View
            style={[
              styles.compactDetailsBtn,
              { paddingHorizontal: s(10), paddingVertical: vs(4) },
            ]}
          >
            <Text style={[styles.compactDetailsText, { fontSize: ms(11) }]}>
              Details
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.md,
  },
  featuredImageWrapper: {
    width: '100%',
    borderRadius: ParkRadii.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: ParkColors.surfaceContainer,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredBadgesTop: {
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  instantBookBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  instantBookText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  coveredBadge: {
    backgroundColor: 'rgba(11, 37, 69, 0.75)',
    borderRadius: 9999,
  },
  coveredText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  pricePill: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 9999,
    gap: 2,
    ...ParkShadows.md,
  },
  pricePillFigure: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  pricePillUnit: {
    color: ParkColors.textMuted,
  },
  featuredBody: {
    paddingHorizontal: 4,
  },
  titleRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredTitle: {
    fontWeight: '700',
    color: ParkColors.text,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 6,
  },
  ratingScore: {
    fontWeight: '700',
    color: ParkColors.text,
  },
  ratingCount: {
    color: ParkColors.textMuted,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceTextBold: {
    fontWeight: '600',
    color: ParkColors.text,
  },
  distanceDot: {
    color: ParkColors.textMuted,
  },
  distanceText: {
    color: ParkColors.textMuted,
    flexShrink: 1,
  },
  hostCredentialBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hostTextCol: {
    flex: 1,
  },
  hostAvatarWrapper: {
    position: 'relative',
  },
  hostAvatar: {
    backgroundColor: ParkColors.surfaceHigh,
  },
  hostVerifiedDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  hostName: {
    fontWeight: '600',
    color: ParkColors.text,
  },
  hostVerifiedLabel: {
    color: ParkColors.textMuted,
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Compact styles
  compactCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    alignItems: 'center',
    ...ParkShadows.sm,
  },
  compactImageWrapper: {
    borderRadius: ParkRadii.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: ParkColors.surfaceContainer,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactCoveredTag: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(11, 37, 69, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  compactTagText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  compactContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  compactTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  compactSecurityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 1,
  },
  compactSecurityText: {
    color: ParkColors.secondary,
    fontWeight: '600',
  },
  compactPrice: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  compactPriceUnit: {
    fontWeight: '400',
    color: ParkColors.textMuted,
  },
  compactTitle: {
    fontWeight: '700',
    color: ParkColors.text,
  },
  compactAddress: {
    color: ParkColors.textMuted,
  },
  compactBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  compactHost: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactHostAvatar: {
    backgroundColor: ParkColors.surfaceHigh,
  },
  compactHostName: {
    color: ParkColors.text,
    fontWeight: '500',
    flexShrink: 1,
  },
  compactDetailsBtn: {
    backgroundColor: ParkColors.surfaceHigh,
    borderRadius: 9999,
  },
  compactDetailsText: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
});
