import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Rect, Text as SvgText } from 'react-native-svg';

import { ParkColors, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

export interface ParkMapPin {
  id: string;
  type: 'private' | 'public';
  title: string;
  price: number;
  lat: number;
  lng: number;
  isCovered?: boolean;
  vehicleType?: 'car' | 'bike' | 'suv';
}

export interface ParkMapProps {
  pins: ParkMapPin[];
  selectedId: string | null;
  onSelectPin: (id: string) => void;
  height?: number;
}

// Convert Lahore coordinates to SVG percentage coordinates for the Gulberg area map
function getPinPosition(id: string, index: number) {
  const positions: Record<string, { left: string; top: string }> = {
    'spot-1': { left: '48%', top: '34%' },     // Covered Garage near Liberty (Featured)
    'spot-2': { left: '22%', top: '30%' },     // Spacious Paved Driveway
    'spot-3': { left: '66%', top: '60%' },     // Gated MM Alam Plot
    'spot-4': { left: '80%', top: '40%' },     // Model Town
    'spot-7': { left: '16%', top: '68%' },     // Anarkali Bike spot
    'spot-pub-1': { left: '72%', top: '40%' }, // Liberty Plaza (Amber)
    'spot-pub-2': { left: '84%', top: '72%' }, // Emporium
    'spot-pub-3': { left: '18%', top: '80%' }, // Mayo
  };

  if (positions[id]) {
    return positions[id];
  }

  // Fallback distribution for dynamically added listings
  const baseLeft = 20 + ((index * 27) % 65);
  const baseTop = 25 + ((index * 23) % 55);
  return { left: `${baseLeft}%`, top: `${baseTop}%` };
}

export const ParkMap: React.FC<ParkMapProps> = ({
  pins,
  selectedId,
  onSelectPin,
  height,
}) => {
  const { s, vs, ms, hPad, mapHeight } = useResponsive();
  const effectiveHeight = height ?? mapHeight;

  return (
    <View style={[styles.container, { height: effectiveHeight }]}>
      {/* Stylized Lahore Transit Map Vector Canvas */}
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 400 420" preserveAspectRatio="xMidYMid slice">
        <Rect width="400" height="420" fill="#E8EEF8" />
        
        {/* Parks & Greens: Gaddafi Complex & Gulberg Parks */}
        <Path
          d="M290 40C330 40 375 75 365 140C350 200 300 180 280 150C260 120 270 40 290 40Z"
          fill="#D3E8D8"
          opacity={0.8}
        />
        <Rect x="20" y="270" width="80" height="90" rx="20" fill="#D3E8D8" opacity={0.6} />

        {/* Lahore Canals & Roads Base */}
        {/* Main Boulevard Gulberg (Major arterial artery) */}
        <Path d="M-20 220 L420 180" stroke="#FFFFFF" strokeLinecap="round" strokeWidth="26" />
        <Path d="M-20 220 L420 180" stroke="#CBD8EE" strokeLinecap="round" strokeWidth="18" />

        {/* MM Alam Road */}
        <Path d="M120 -20 L155 440" stroke="#FFFFFF" strokeWidth="18" />
        <Path d="M120 -20 L155 440" stroke="#DCE5F5" strokeWidth="12" />

        {/* Liberty Roundabout */}
        <Circle cx="210" cy="200" r="34" fill="#FFFFFF" />
        <Circle cx="210" cy="200" r="24" fill="#E2EDF9" />
        <Circle cx="210" cy="200" r="13" fill="#B9DBBA" />

        {/* Secondary Streets */}
        <Path d="M210 200 L310 390" stroke="#FFFFFF" strokeWidth="12" />
        <Path d="M210 200 L310 390" stroke="#E2EBF8" strokeWidth="8" />
        <Path d="M40 70 L380 90" stroke="#FFFFFF" strokeWidth="8" />
        <Path d="M15 310 L380 320" stroke="#FFFFFF" strokeWidth="8" />
        <Path d="M270 -20 L290 440" stroke="#FFFFFF" strokeWidth="8" />
        <Path d="M50 140 L210 200" stroke="#FFFFFF" strokeWidth="10" />

        {/* Street Label Watermarks */}
        <SvgText
          x="22"
          y="206"
          fill="#758AA6"
          fontSize="9"
          fontWeight="bold"
          letterSpacing="1.2"
        >
          MAIN BOULEVARD GULBERG
        </SvgText>
        <SvgText
          x="215"
          y="196"
          fill="#3D5A80"
          fontSize="8"
          fontWeight="bold"
          textAnchor="middle"
        >
          LIBERTY
        </SvgText>
        <SvgText
          x="295"
          y="105"
          fill="#587F63"
          fontSize="8"
          fontWeight="600"
        >
          GADDAFI STADIUM
        </SvgText>
      </Svg>

      {/* User Location Pulse Indicator (On Main Blvd Gulberg) */}
      <View style={styles.userPulseWrapper}>
        <View
          style={[
            styles.userPulseOuter,
            { width: ms(28), height: ms(28), borderRadius: ms(14) },
          ]}
        />
        <View
          style={[
            styles.userPulseDot,
            { width: ms(14), height: ms(14), borderRadius: ms(7) },
          ]}
        />
      </View>

      {/* Tappable Map Markers */}
      {pins.map((pin, index) => {
        const isSelected = pin.id === selectedId;
        const pos = getPinPosition(pin.id, index);

        if (pin.type === 'public') {
          return (
            <TouchableOpacity
              key={pin.id}
              activeOpacity={0.85}
              style={[styles.pinWrapper, { left: pos.left as any, top: pos.top as any }]}
              onPress={() => onSelectPin(pin.id)}
            >
              <View
                style={[
                  styles.publicBadge,
                  { paddingHorizontal: s(8), paddingVertical: vs(4) },
                  isSelected && styles.pinSelectedHalo,
                ]}
              >
                <View
                  style={[
                    styles.publicBadgeIcon,
                    { width: ms(16), height: ms(16), borderRadius: ms(8) },
                  ]}
                >
                  <Text style={[styles.publicBadgeIconText, { fontSize: ms(9.5) }]}>
                    P
                  </Text>
                </View>
                <Text style={[styles.publicBadgeText, { fontSize: ms(10) }]}>
                  {pin.title.split(' ')[0]} • Rs {pin.price}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }

        // Bike Specific Pin
        if (pin.vehicleType === 'bike') {
          return (
            <TouchableOpacity
              key={pin.id}
              activeOpacity={0.85}
              style={[styles.pinWrapper, { left: pos.left as any, top: pos.top as any }]}
              onPress={() => onSelectPin(pin.id)}
            >
              <View
                style={[
                  styles.bikePin,
                  { paddingHorizontal: s(8), paddingVertical: vs(3.5) },
                  isSelected && styles.pinSelectedHalo,
                ]}
              >
                <MaterialIcons name="two-wheeler" size={ms(13)} color={ParkColors.secondary} />
                <Text style={[styles.bikePinText, { fontSize: ms(11) }]}>
                  Rs {pin.price}
                </Text>
              </View>
              <View style={styles.bikePinTriangle} />
            </TouchableOpacity>
          );
        }

        // Standard Private P2P Price Pin
        return (
          <TouchableOpacity
            key={pin.id}
            activeOpacity={0.85}
            style={[
              styles.pinWrapper,
              { left: pos.left as any, top: pos.top as any },
              isSelected && { zIndex: 30 },
            ]}
            onPress={() => onSelectPin(pin.id)}
          >
            <View
              style={[
                styles.privatePin,
                {
                  paddingHorizontal: isSelected ? s(11) : s(9),
                  paddingVertical: isSelected ? vs(5.5) : vs(4.5),
                },
                isSelected ? styles.privatePinActive : styles.privatePinInactive,
                isSelected && styles.pinSelectedHalo,
              ]}
            >
              {isSelected && (
                <MaterialIcons name="shield" size={ms(11.5)} color="#FFFFFF" style={{ marginRight: 2 }} />
              )}
              <Text
                style={[
                  styles.privatePinText,
                  { fontSize: isSelected ? ms(12) : ms(11) },
                ]}
              >
                Rs {pin.price}
              </Text>
              {isSelected && (
                <Text style={[styles.privatePinSubtext, { fontSize: ms(10) }]}>
                  /hr
                </Text>
              )}
            </View>
            <View
              style={[
                styles.privatePinTriangle,
                isSelected
                  ? styles.privatePinTriangleActive
                  : styles.privatePinTriangleInactive,
              ]}
            />
          </TouchableOpacity>
        );
      })}

      {/* Floating Availability Pill in Bottom Left */}
      <View
        style={[
          styles.spotCountOverlay,
          {
            left: hPad,
            bottom: vs(10),
            paddingHorizontal: s(11),
            paddingVertical: vs(5.5),
          },
        ]}
      >
        <View style={styles.activeSpotGreenDot} />
        <Text style={[styles.spotCountText, { fontSize: ms(11) }]}>
          {pins.length} Verified Spots in Gulberg
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#E8EEF8',
  },
  userPulseWrapper: {
    position: 'absolute',
    left: '26%',
    top: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  userPulseOuter: {
    position: 'absolute',
    backgroundColor: 'rgba(31, 111, 235, 0.25)',
  },
  userPulseDot: {
    backgroundColor: ParkColors.secondary,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    ...ParkShadows.sm,
  },
  pinWrapper: {
    position: 'absolute',
    transform: [{ translateX: -30 }, { translateY: -15 }],
    alignItems: 'center',
    zIndex: 10,
  },
  privatePin: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    ...ParkShadows.md,
  },
  privatePinActive: {
    backgroundColor: ParkColors.secondary,
    borderColor: '#FFFFFF',
    borderWidth: 2.5,
  },
  privatePinInactive: {
    backgroundColor: ParkColors.primary,
  },
  privatePinText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  privatePinSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '400',
    marginLeft: 1,
  },
  privatePinTriangle: {
    width: 6,
    height: 6,
    transform: [{ rotate: '45deg' }],
    marginTop: -3,
  },
  privatePinTriangleActive: {
    backgroundColor: ParkColors.secondary,
  },
  privatePinTriangleInactive: {
    backgroundColor: ParkColors.primary,
  },
  bikePin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  bikePinText: {
    color: ParkColors.text,
    fontWeight: '700',
  },
  bikePinTriangle: {
    width: 5,
    height: 5,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -2.5,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: ParkColors.border,
  },
  publicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: ParkColors.amberDim,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...ParkShadows.sm,
  },
  publicBadgeIcon: {
    backgroundColor: '#291800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  publicBadgeIconText: {
    color: '#FFDDB4',
    fontWeight: '900',
  },
  publicBadgeText: {
    color: '#291800',
    fontWeight: '700',
  },
  pinSelectedHalo: {
    shadowColor: ParkColors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    transform: [{ scale: 1.08 }],
  },
  spotCountOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 9999,
    ...ParkShadows.sm,
  },
  activeSpotGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  spotCountText: {
    fontWeight: '600',
    color: ParkColors.text,
  },
});
