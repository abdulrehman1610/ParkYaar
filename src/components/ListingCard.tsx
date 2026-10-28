import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  featured = false,
}) => {
  const router = useRouter();

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
        style={styles.featuredCard}
        activeOpacity={0.92}
        onPress={handlePress}
      >
        {/* Hero Image Container */}
        <View style={styles.featuredImageWrapper}>
          <Image
            source={{ uri: listing.photos[0] }}
            style={styles.featuredImage}
          />
          {/* Top Badges */}
          <View style={styles.featuredBadgesTop}>
            {listing.instantBook && (
              <View style={styles.instantBookBadge}>
                <MaterialIcons name="bolt" size={13} color="#FFFFFF" />
                <Text style={styles.instantBookText}>Instant Book</Text>
              </View>
            )}
            {listing.isCovered && (
              <View style={styles.coveredBadge}>
                <Text style={styles.coveredText}>Covered</Text>
              </View>
            )}
          </View>

          {/* Bottom Right Price Pill */}
          <View style={styles.pricePill}>
            <Text style={styles.pricePillFigure}>Rs {listing.pricePerHour}</Text>
            <Text style={styles.pricePillUnit}>/hr</Text>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.featuredBody}>
          <View style={styles.titleRatingRow}>
            <Text style={styles.featuredTitle} numberOfLines={1}>
              {listing.title}
            </Text>
            <View style={styles.ratingBadge}>
              <MaterialIcons name="star" size={14} color={ParkColors.amber} />
              <Text style={styles.ratingScore}>{listing.rating}</Text>
              <Text style={styles.ratingCount}>({listing.reviewCount})</Text>
            </View>
          </View>

          {/* Distance & Walking */}
          <View style={styles.distanceRow}>
            <MaterialIcons name="near-me" size={14} color={ParkColors.secondary} />
            <Text style={styles.distanceTextBold}>{listing.distance}</Text>
            <Text style={styles.distanceDot}>•</Text>
            <Text style={styles.distanceText}>{listing.walkTime}</Text>
          </View>

          {/* Host Credential Bar */}
          <View style={styles.hostCredentialBar}>
            <View style={styles.hostInfo}>
              <View style={styles.hostAvatarWrapper}>
                <Image
                  source={{ uri: listing.hostPhoto }}
                  style={styles.hostAvatar}
                />
                {listing.hostVerified && (
                  <View style={styles.hostVerifiedDot}>
                    <MaterialIcons name="verified" size={12} color={ParkColors.secondary} />
                  </View>
                )}
              </View>
              <View>
                <Text style={styles.hostName}>{listing.hostName}</Text>
                <Text style={styles.hostVerifiedLabel}>
                  {listing.type === 'public' ? 'Official Facility' : 'CNIC Verified Host'}
                </Text>
              </View>
            </View>

            {/* CTA Pill */}
            <View style={styles.reserveButton}>
              <Text style={styles.reserveButtonText}>Reserve Bay</Text>
              <MaterialIcons name="chevron-right" size={16} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Compact Card Variant
  return (
    <TouchableOpacity
      style={styles.compactCard}
      activeOpacity={0.88}
      onPress={handlePress}
    >
      <View style={styles.compactImageWrapper}>
        <Image
          source={{ uri: listing.photos[0] }}
          style={styles.compactImage}
        />
        {listing.isCovered ? (
          <View style={styles.compactCoveredTag}>
            <Text style={styles.compactTagText}>Covered</Text>
          </View>
        ) : (
          <View style={styles.compactCoveredTag}>
            <Text style={styles.compactTagText}>Paved</Text>
          </View>
        )}
      </View>

      <View style={styles.compactContent}>
        <View style={styles.compactTopRow}>
          <View style={styles.compactSecurityTag}>
            <MaterialIcons
              name={listing.cctv ? 'videocam' : 'verified-user'}
              size={12}
              color={ParkColors.secondary}
            />
            <Text style={styles.compactSecurityText}>
              {listing.cctv ? '24/7 CCTV' : 'Secured'}
            </Text>
          </View>
          <Text style={styles.compactPrice}>
            Rs {listing.pricePerHour}
            <Text style={styles.compactPriceUnit}>/hr</Text>
          </Text>
        </View>

        <Text style={styles.compactTitle} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.compactAddress} numberOfLines={1}>
          {listing.distance} • {listing.area}
        </Text>

        <View style={styles.compactBottomRow}>
          <View style={styles.compactHost}>
            <Image
              source={{ uri: listing.hostPhoto }}
              style={styles.compactHostAvatar}
            />
            <Text style={styles.compactHostName} numberOfLines={1}>
              {listing.hostName}
            </Text>
            {listing.hostVerified && (
              <MaterialIcons name="verified" size={13} color={ParkColors.secondary} />
            )}
          </View>
          <View style={styles.compactDetailsBtn}>
            <Text style={styles.compactDetailsText}>Details</Text>
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
    padding: 10,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.md,
  },
  featuredImageWrapper: {
    width: '100%',
    height: 175,
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
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  instantBookBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.secondary,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  instantBookText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  coveredBadge: {
    backgroundColor: 'rgba(11, 37, 69, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  coveredText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  pricePill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    gap: 2,
    ...ParkShadows.md,
  },
  pricePillFigure: {
    fontSize: 18,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  pricePillUnit: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
  featuredBody: {
    paddingTop: 10,
    paddingHorizontal: 4,
    gap: 4,
  },
  titleRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ParkColors.text,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.text,
  },
  ratingCount: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceTextBold: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.text,
  },
  distanceDot: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  distanceText: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  hostCredentialBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.surfaceLow,
    padding: 8,
    borderRadius: ParkRadii.md,
    marginTop: 6,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  hostAvatarWrapper: {
    position: 'relative',
  },
  hostAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.text,
  },
  hostVerifiedLabel: {
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: ParkColors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Compact styles
  compactCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 12,
    alignItems: 'center',
    ...ParkShadows.sm,
  },
  compactImageWrapper: {
    width: 100,
    height: 100,
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
    fontSize: 10,
    fontWeight: '600',
  },
  compactContent: {
    flex: 1,
    justifyContent: 'space-between',
    height: 100,
    paddingVertical: 2,
  },
  compactTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactSecurityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  compactSecurityText: {
    fontSize: 11,
    color: ParkColors.secondary,
    fontWeight: '600',
  },
  compactPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  compactPriceUnit: {
    fontSize: 11,
    fontWeight: '400',
    color: ParkColors.textMuted,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  compactAddress: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
  compactBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactHost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  compactHostAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ParkColors.surfaceHigh,
  },
  compactHostName: {
    fontSize: 11,
    color: ParkColors.text,
    fontWeight: '500',
    maxWidth: 80,
  },
  compactDetailsBtn: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  compactDetailsText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.primary,
  },
});

