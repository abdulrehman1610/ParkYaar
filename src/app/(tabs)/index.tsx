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
import { useParkStore } from '@/store/useParkStore';
import { SpotType, VehicleType } from '@/types';

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

  const [selectedPinId, setSelectedPinId] = useState<string | null>('spot-1');
  const [cctvOnly, setCctvOnly] = useState(false);

  // Filter listings based on active controls
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Type filter
      if (item.type !== selectedSpotType) return false;

      // Active state
      if (item.isActive === false) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.area.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Vehicle filter
      if (selectedVehicleFilter !== 'all') {
        if (!item.vehicleTypes.includes(selectedVehicleFilter as VehicleType)) {
          return false;
        }
      }

      // Covered filter
      if (coveredFilter && !item.isCovered) return false;

      // CCTV filter
      if (cctvOnly && !item.cctv) return false;

      // Max price filter
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
      vehicleType: l.vehicleTypes.includes('bike') && l.vehicleTypes.length === 1 ? 'bike' : 'car',
    }));
  }, [filteredListings]);

  return (
    <View style={styles.container}>
      {/* Top Header with Brand & City Switcher */}
      <Header />

      <ScrollView
        style={styles.mainScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Top Controls Section */}
        <View style={styles.controlsSection}>
          {/* Search Input Box */}
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={22} color={ParkColors.secondary} />
            <View style={styles.searchInner}>
              <Text style={styles.searchLabel}>Where in Lahore?</Text>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Gulberg III, near Liberty Market"
                placeholderTextColor={ParkColors.textMuted}
              />
            </View>
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="cancel" size={18} color={ParkColors.textMuted} />
              </TouchableOpacity>
            ) : (
              <View style={styles.tuneButton}>
                <MaterialIcons name="tune" size={18} color={ParkColors.primary} />
              </View>
            )}
          </View>

          {/* Mode Selector: Private Driveways vs Public & Corporate */}
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                selectedSpotType === 'private' && styles.modeButtonActive,
              ]}
              activeOpacity={0.85}
              onPress={() => setSelectedSpotType('private')}
            >
              <MaterialIcons
                name="garage"
                size={16}
                color={selectedSpotType === 'private' ? '#FFFFFF' : ParkColors.textMuted}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  selectedSpotType === 'private' && styles.modeButtonTextActive,
                ]}
              >
                Private Driveways
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                selectedSpotType === 'public' && styles.modeButtonActive,
              ]}
              activeOpacity={0.85}
              onPress={() => setSelectedSpotType('public')}
            >
              <MaterialIcons
                name="local-parking"
                size={16}
                color={selectedSpotType === 'public' ? '#FFFFFF' : ParkColors.textMuted}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  selectedSpotType === 'public' && styles.modeButtonTextActive,
                ]}
              >
                Public & Corporate
              </Text>
              <View style={styles.publicLotsPill}>
                <Text style={styles.publicLotsPillText}>24 lots</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Horizontal Quick Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsRow}
          >
            {/* Car Chip */}
            <TouchableOpacity
              style={[
                styles.filterChip,
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
                size={16}
                color={selectedVehicleFilter === 'car' ? '#FFFFFF' : ParkColors.text}
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedVehicleFilter === 'car' && styles.filterChipTextActive,
                ]}
              >
                Car
              </Text>
              {selectedVehicleFilter === 'car' && (
                <MaterialIcons name="check" size={14} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            {/* Covered Chip */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                coveredFilter && styles.filterChipActive,
              ]}
              onPress={() => setCoveredFilter(!coveredFilter)}
            >
              <MaterialIcons
                name="roofing"
                size={16}
                color={coveredFilter ? '#FFFFFF' : ParkColors.text}
              />
              <Text
                style={[
                  styles.filterChipText,
                  coveredFilter && styles.filterChipTextActive,
                ]}
              >
                Covered
              </Text>
              {coveredFilter && (
                <MaterialIcons name="check" size={14} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            {/* Under Rs 200 Chip */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                maxPriceFilter === 200 && styles.filterChipActive,
              ]}
              onPress={() =>
                setMaxPriceFilter(maxPriceFilter === 200 ? null : 200)
              }
            >
              <Text
                style={[
                  styles.filterChipText,
                  maxPriceFilter === 200 && styles.filterChipTextActive,
                ]}
              >
                Under Rs 200
              </Text>
              {maxPriceFilter === 200 && (
                <MaterialIcons name="check" size={14} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            {/* Bike Chip */}
            <TouchableOpacity
              style={[
                styles.filterChip,
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
                size={16}
                color={selectedVehicleFilter === 'bike' ? '#FFFFFF' : ParkColors.text}
              />
              <Text
                style={[
                  styles.filterChipText,
                  selectedVehicleFilter === 'bike' && styles.filterChipTextActive,
                ]}
              >
                Bike
              </Text>
            </TouchableOpacity>

            {/* CCTV Chip */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                cctvOnly && styles.filterChipActive,
              ]}
              onPress={() => setCctvOnly(!cctvOnly)}
            >
              <MaterialIcons
                name="videocam"
                size={16}
                color={cctvOnly ? '#FFFFFF' : ParkColors.text}
              />
              <Text
                style={[
                  styles.filterChipText,
                  cctvOnly && styles.filterChipTextActive,
                ]}
              >
                CCTV Verified
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Lahore Map Canvas Layer */}
        <ParkMap
          pins={mapPins}
          selectedId={selectedPinId}
          onSelectPin={(id) => {
            setSelectedPinId(id);
            // Quick scroll or tap opens listing
            if (id.startsWith('spot-pub')) {
              router.push(`/public-spot/${id}` as any);
            } else {
              router.push(`/listing/${id}` as any);
            }
          }}
          height={380}
        />

        {/* Bottom Sheet List of Verified Spots */}
        <View style={styles.bottomSheetArea}>
          <View style={styles.sheetHeaderRow}>
            <View style={styles.sheetTitleGroup}>
              <Text style={styles.sheetTitle}>Nearby Verified Spots</Text>
              <View style={styles.areaBadge}>
                <Text style={styles.areaBadgeText}>Gulberg III</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <View style={styles.viewAllRow}>
                <Text style={styles.viewAllText}>
                  View all ({filteredListings.length})
                </Text>
                <MaterialIcons name="arrow-forward" size={14} color={ParkColors.secondary} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Cards List */}
          <View style={styles.cardsStack}>
            {filteredListings.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="search-off" size={42} color={ParkColors.textMuted} />
                <Text style={styles.emptyTitle}>No parking spots match your filters</Text>
                <Text style={styles.emptySubtitle}>
                  Try clearing filter chips or searching for Gulberg, DHA, or Model Town.
                </Text>
              </View>
            ) : (
              filteredListings.map((listing, index) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  featured={index === 0}
                />
              ))
            )}
          </View>

          {/* P2P Safety Guarantee Banner */}
          <View style={styles.safetyGuaranteeBanner}>
            <View style={styles.safetyShieldCircle}>
              <MaterialIcons name="verified-user" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.safetyTextGroup}>
              <Text style={styles.safetyTitle}>ParkYaar Safety Guarantee</Text>
              <Text style={styles.safetySubtitle}>
                All Lahore driveways are physically inspected & CNIC vetted for 100% vehicle peace of mind.
              </Text>
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
    paddingBottom: 120,
  },
  controlsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.md,
  },
  searchInner: {
    flex: 1,
    marginLeft: 10,
  },
  searchLabel: {
    fontSize: 10,
    color: ParkColors.textMuted,
    fontWeight: '600',
  },
  searchInput: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
    padding: 0,
    margin: 0,
  },
  tuneButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    paddingVertical: 8,
    borderRadius: 9999,
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: ParkColors.secondary,
    ...ParkShadows.sm,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.textMuted,
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
    fontSize: 9,
    fontWeight: '800',
    color: '#291800',
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 5,
    ...ParkShadows.sm,
  },
  filterChipActive: {
    backgroundColor: ParkColors.primary,
    borderColor: ParkColors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.text,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  bottomSheetArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sheetTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ParkColors.text,
  },
  areaBadge: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  areaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.secondary,
  },
  cardsStack: {
    gap: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ParkColors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    color: ParkColors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  safetyGuaranteeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceLow,
    padding: 14,
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 12,
    marginTop: 8,
  },
  safetyShieldCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyTextGroup: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  safetySubtitle: {
    fontSize: 11,
    color: ParkColors.textVariant,
    lineHeight: 16,
    marginTop: 2,
  },
});

