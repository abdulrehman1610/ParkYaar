import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header } from '@/components/Header';
import { ListingCard } from '@/components/ListingCard';
import { ParkMap, ParkMapPin } from '@/components/ParkMap';
import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';
import { VehicleType } from '@/types';

export default function ExploreScreen() {
  const router = useRouter();
  const {
    listings,
    selectedSpotType,
    setSelectedSpotType,
    searchQuery,
    setSearchQuery,
    selectedVehicleFilter,
    setSelectedVehicleFilter,
    coveredFilter,
    setCoveredFilter,
    maxPriceFilter,
    setMaxPriceFilter,
  } = useParkStore();

  const {
    s,
    vs,
    ms,
    hPad,
    vGap,
    chipGap,
    tabScrollBottomPad,
    contentMaxWidth,
    numColumns,
    mapHeight,
    isSmallPhone,
    isWide,
  } = useResponsive();

  const [selectedPinId, setSelectedPinId] = useState<string | null>('spot-1');
  const [cctvOnly, setCctvOnly] = useState(false);

  // Filter listings based on active controls
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (item.type !== selectedSpotType) return false;
      if (item.isActive === false) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.area.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedVehicleFilter !== 'all') {
        if (!item.vehicleTypes.includes(selectedVehicleFilter as VehicleType)) {
          return false;
        }
      }

      if (coveredFilter && !item.isCovered) return false;
      if (cctvOnly && !item.cctv) return false;
      if (maxPriceFilter !== null && item.pricePerHour > maxPriceFilter) {
        return false;
      }

      return true;
    });
  }, [
    listings,
    selectedSpotType,
    searchQuery,
    selectedVehicleFilter,
    coveredFilter,
    cctvOnly,
    maxPriceFilter,
  ]);

  // Convert listings to map pins
  const mapPins: ParkMapPin[] = useMemo(() => {
    return filteredListings.map((l) => ({
      id: l.id,
      type: l.type,
      title: l.title,
      price: l.pricePerHour,
      lat: l.lat,
      lng: l.lng,
      isCovered: l.isCovered,
      vehicleType:
        l.vehicleTypes.includes('bike') && l.vehicleTypes.length === 1
          ? 'bike'
          : 'car',
    }));
  }, [filteredListings]);

  return (
    <View style={styles.container}>
      {/* Top Header with Brand & City Switcher */}
      <Header />

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabScrollBottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Top Controls Section */}
        <View style={styles.controlsOuter}>
          <View
            style={[
              styles.controlsSection,
              {
                maxWidth: contentMaxWidth,
                paddingHorizontal: hPad,
                paddingTop: vs(8),
                paddingBottom: vs(12),
                gap: vs(10),
              },
            ]}
          >
            {/* Search Input Box */}
            <View
              style={[
                styles.searchBar,
                {
                  paddingHorizontal: s(14),
                  paddingVertical: vs(6),
                },
              ]}
            >
              <MaterialIcons
                name="search"
                size={ms(21)}
                color={ParkColors.secondary}
              />
              <View style={[styles.searchInner, { marginLeft: s(10) }]}>
                <Text style={[styles.searchLabel, { fontSize: ms(10) }]}>
                  Where in Lahore?
                </Text>
                <TextInput
                  style={[styles.searchInput, { fontSize: ms(13.5) }]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Gulberg III, near Liberty Market"
                  placeholderTextColor={ParkColors.textMuted}
                />
              </View>
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons
                    name="cancel"
                    size={ms(18)}
                    color={ParkColors.textMuted}
                  />
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.tuneButton,
                    {
                      width: ms(32),
                      height: ms(32),
                      borderRadius: ms(16),
                    },
                  ]}
                >
                  <MaterialIcons
                    name="tune"
                    size={ms(17)}
                    color={ParkColors.primary}
                  />
                </View>
              )}
            </View>

            {/* Mode Selector: Private Driveways vs Public & Corporate */}
            <View style={styles.modeSelector}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  { paddingVertical: vs(8), gap: s(5) },
                  selectedSpotType === 'private' && styles.modeButtonActive,
                ]}
                activeOpacity={0.85}
                onPress={() => setSelectedSpotType('private')}
              >
                <MaterialIcons
                  name="garage"
                  size={ms(15)}
                  color={
                    selectedSpotType === 'private'
                      ? '#FFFFFF'
                      : ParkColors.textMuted
                  }
                />
                <Text
                  style={[
                    styles.modeButtonText,
                    { fontSize: ms(11.5) },
                    selectedSpotType === 'private' && styles.modeButtonTextActive,
                  ]}
                  numberOfLines={1}
                >
                  Private Driveways
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeButton,
                  { paddingVertical: vs(8), gap: s(5) },
                  selectedSpotType === 'public' && styles.modeButtonActive,
                ]}
                activeOpacity={0.85}
                onPress={() => setSelectedSpotType('public')}
              >
                <MaterialIcons
                  name="local-parking"
                  size={ms(15)}
                  color={
                    selectedSpotType === 'public'
                      ? '#FFFFFF'
                      : ParkColors.textMuted
                  }
                />
                <Text
                  style={[
                    styles.modeButtonText,
                    { fontSize: ms(11.5) },
                    selectedSpotType === 'public' && styles.modeButtonTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {isSmallPhone ? 'Public Lots' : 'Public & Corporate'}
                </Text>
                <View style={styles.publicLotsPill}>
                  <Text style={[styles.publicLotsPillText, { fontSize: ms(8.5) }]}>
                    24 lots
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Horizontal Quick Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.filterChipsRow, { gap: chipGap }]}
            >
              {/* Car Chip */}
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { paddingHorizontal: s(12), paddingVertical: vs(6.5) },
                  selectedVehicleFilter === 'car' && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedVehicleFilter(
                    selectedVehicleFilter === 'car' ? 'all' : 'car'
                  )
                }
              >
                <MaterialIcons
                  name="directions-car"
                  size={ms(15)}
                  color={
                    selectedVehicleFilter === 'car'
                      ? '#FFFFFF'
                      : ParkColors.text
                  }
                />
                <Text
                  style={[
                    styles.filterChipText,
                    { fontSize: ms(12) },
                    selectedVehicleFilter === 'car' &&
                      styles.filterChipTextActive,
                  ]}
                >
                  Car
                </Text>
                {selectedVehicleFilter === 'car' && (
                  <MaterialIcons name="check" size={ms(13)} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              {/* Covered Chip */}
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { paddingHorizontal: s(12), paddingVertical: vs(6.5) },
                  coveredFilter && styles.filterChipActive,
                ]}
                onPress={() => setCoveredFilter(!coveredFilter)}
              >
                <MaterialIcons
                  name="roofing"
                  size={ms(15)}
                  color={coveredFilter ? '#FFFFFF' : ParkColors.text}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    { fontSize: ms(12) },
                    coveredFilter && styles.filterChipTextActive,
                  ]}
                >
                  Covered
                </Text>
                {coveredFilter && (
                  <MaterialIcons name="check" size={ms(13)} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              {/* Under Rs 200 Chip */}
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { paddingHorizontal: s(12), paddingVertical: vs(6.5) },
                  maxPriceFilter === 200 && styles.filterChipActive,
                ]}
                onPress={() =>
                  setMaxPriceFilter(maxPriceFilter === 200 ? null : 200)
                }
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { fontSize: ms(12) },
                    maxPriceFilter === 200 && styles.filterChipTextActive,
                  ]}
                >
                  Under Rs 200
                </Text>
                {maxPriceFilter === 200 && (
                  <MaterialIcons name="check" size={ms(13)} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              {/* Bike Chip */}
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { paddingHorizontal: s(12), paddingVertical: vs(6.5) },
                  selectedVehicleFilter === 'bike' && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedVehicleFilter(
                    selectedVehicleFilter === 'bike' ? 'all' : 'bike'
                  )
                }
              >
                <MaterialIcons
                  name="two-wheeler"
                  size={ms(15)}
                  color={
                    selectedVehicleFilter === 'bike'
                      ? '#FFFFFF'
                      : ParkColors.text
                  }
                />
                <Text
                  style={[
                    styles.filterChipText,
                    { fontSize: ms(12) },
                    selectedVehicleFilter === 'bike' &&
                      styles.filterChipTextActive,
                  ]}
                >
                  Bike
                </Text>
              </TouchableOpacity>

              {/* CCTV Chip */}
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { paddingHorizontal: s(12), paddingVertical: vs(6.5) },
                  cctvOnly && styles.filterChipActive,
                ]}
                onPress={() => setCctvOnly(!cctvOnly)}
              >
                <MaterialIcons
                  name="videocam"
                  size={ms(15)}
                  color={cctvOnly ? '#FFFFFF' : ParkColors.text}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    { fontSize: ms(12) },
                    cctvOnly && styles.filterChipTextActive,
                  ]}
                >
                  CCTV Verified
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        {/* Lahore Map Canvas Layer */}
        <ParkMap
          pins={mapPins}
          selectedId={selectedPinId}
          onSelectPin={(id) => {
            setSelectedPinId(id);
            if (id.startsWith('spot-pub')) {
              router.push(`/public-spot/${id}` as any);
            } else {
              router.push(`/listing/${id}` as any);
            }
          }}
          height={mapHeight}
        />

        {/* Bottom Sheet List of Verified Spots */}
        <View style={styles.bottomSheetOuter}>
          <View
            style={[
              styles.bottomSheetArea,
              {
                maxWidth: contentMaxWidth,
                paddingHorizontal: hPad,
                paddingTop: vs(16),
                gap: vGap,
              },
            ]}
          >
            <View style={styles.sheetHeaderRow}>
              <View style={[styles.sheetTitleGroup, { gap: s(8) }]}>
                <Text style={[styles.sheetTitle, { fontSize: ms(16) }]}>
                  Nearby Verified Spots
                </Text>
                <View style={styles.areaBadge}>
                  <Text style={[styles.areaBadgeText, { fontSize: ms(11) }]}>
                    Gulberg III
                  </Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.viewAllRow}>
                  <Text style={[styles.viewAllText, { fontSize: ms(12) }]}>
                    View all ({filteredListings.length})
                  </Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={ms(14)}
                    color={ParkColors.secondary}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Cards List / Responsive Grid */}
            {filteredListings.length === 0 ? (
              <View style={[styles.emptyState, { padding: s(28) }]}>
                <MaterialIcons
                  name="search-off"
                  size={ms(40)}
                  color={ParkColors.textMuted}
                />
                <Text style={[styles.emptyTitle, { fontSize: ms(15) }]}>
                  No parking spots match your filters
                </Text>
                <Text style={[styles.emptySubtitle, { fontSize: ms(12) }]}>
                  Try clearing filter chips or searching for Gulberg, DHA, or
                  Model Town.
                </Text>
              </View>
            ) : (
              <View style={{ gap: vGap }}>
                {/* Featured top spot */}
                <ListingCard listing={filteredListings[0]} featured />

                {/* Remaining spots in responsive grid (1 col on phone, 2-3 cols on tablet/desktop) */}
                {filteredListings.length > 1 && (
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
                    {filteredListings.slice(1).map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        style={
                          isWide
                            ? {
                                flexBasis:
                                  numColumns >= 3 ? '31.5%' : '48.2%',
                                flexGrow: 1,
                              }
                            : undefined
                        }
                      />
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* P2P Safety Guarantee Banner */}
            <View
              style={[
                styles.safetyGuaranteeBanner,
                { padding: s(14), gap: s(12), marginTop: vs(4) },
              ]}
            >
              <View
                style={[
                  styles.safetyShieldCircle,
                  {
                    width: ms(40),
                    height: ms(40),
                    borderRadius: ms(20),
                  },
                ]}
              >
                <MaterialIcons
                  name="verified-user"
                  size={ms(21)}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.safetyTextGroup}>
                <Text style={[styles.safetyTitle, { fontSize: ms(13) }]}>
                  ParkYaar Safety Guarantee
                </Text>
                <Text style={[styles.safetySubtitle, { fontSize: ms(11.5) }]}>
                  All Lahore driveways are physically inspected & CNIC vetted
                  for 100% vehicle peace of mind.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParkColors.background,
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  controlsOuter: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
  },
  controlsSection: {
    width: '100%',
    alignSelf: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.md,
  },
  searchInner: {
    flex: 1,
  },
  searchLabel: {
    color: ParkColors.textMuted,
    fontWeight: '600',
  },
  searchInput: {
    fontWeight: '700',
    color: ParkColors.text,
    padding: 0,
    margin: 0,
  },
  tuneButton: {
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
    padding: 3,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    paddingHorizontal: 6,
  },
  modeButtonActive: {
    backgroundColor: ParkColors.secondary,
    ...ParkShadows.sm,
  },
  modeButtonText: {
    fontWeight: '600',
    color: ParkColors.textMuted,
    flexShrink: 1,
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  publicLotsPill: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  publicLotsPillText: {
    fontWeight: '800',
    color: '#291800',
  },
  filterChipsRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  filterChipActive: {
    backgroundColor: ParkColors.primary,
    borderColor: ParkColors.primary,
  },
  filterChipText: {
    fontWeight: '600',
    color: ParkColors.text,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomSheetOuter: {
    width: '100%',
    backgroundColor: ParkColors.background,
    borderTopLeftRadius: ParkRadii.sheet,
    borderTopRightRadius: ParkRadii.sheet,
    marginTop: -16,
    ...ParkShadows.sheet,
  },
  bottomSheetArea: {
    width: '100%',
    alignSelf: 'center',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  sheetTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  sheetTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  areaBadge: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  areaBadgeText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewAllText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  cardsGrid: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  emptyTitle: {
    fontWeight: '700',
    color: ParkColors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    color: ParkColors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  safetyGuaranteeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  safetyShieldCircle: {
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyTextGroup: {
    flex: 1,
    gap: 2,
  },
  safetyTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  safetySubtitle: {
    color: ParkColors.textMuted,
    lineHeight: 16,
  },
});
