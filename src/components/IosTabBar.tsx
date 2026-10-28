import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ParkColors, ParkShadows } from '@/constants/theme';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TAB_CONFIG: Record<
  string,
  {
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    badge?: string;
  }
> = {
  index: {
    label: 'Explore',
    icon: 'explore',
  },
  bookings: {
    label: 'Bookings',
    icon: 'confirmation-number',
  },
  host: {
    label: 'Host',
    icon: 'vpn-key',
    badge: 'EARN',
  },
  profile: {
    label: 'Profile',
    icon: 'account-circle',
  },
};

export const IosTabBar: React.FC<TabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  // Dynamic bottom clearance to guarantee zero collision with Android 3-button or iOS home indicator
  const bottomMargin = Math.max(insets.bottom, 14) + 6;

  return (
    <View style={[styles.floatingContainer, { bottom: bottomMargin }]}>
      <View style={styles.blurBackdrop}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || {
            label: options.title || route.name,
            icon: 'explore',
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              activeOpacity={0.7}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemActive,
              ]}
            >
              {/* Icon Container with active iOS styling */}
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name={config.icon}
                  size={22}
                  color={isFocused ? ParkColors.secondary : '#8E8E93'}
                />

                {/* Optional iOS Badge (e.g. Amber EARN tag on Host) */}
                {config.badge && (
                  <View style={styles.earnBadge}>
                    <Text style={styles.earnBadgeText}>{config.badge}</Text>
                  </View>
                )}
              </View>

              {/* iOS Style Typography Label */}
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
                numberOfLines={1}
              >
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurBackdrop: {
    width: '100%',
    maxWidth: 400,
    height: 66,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.85)',
    ...ParkShadows.lg,
    shadowColor: '#0B2545',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 16,
    paddingVertical: 4,
    marginHorizontal: 3,
  },
  tabItemActive: {
    backgroundColor: ParkColors.surfaceLow,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  earnBadge: {
    position: 'absolute',
    top: -4,
    right: -24,
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  earnBadgeText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#362000',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 3,
  },
  tabLabelActive: {
    color: ParkColors.secondary,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: '#8E8E93', // iOS System Gray 2
  },
});
