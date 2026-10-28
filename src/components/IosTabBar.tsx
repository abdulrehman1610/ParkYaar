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

import { ParkColors, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

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
  const {
    s,
    ms,
    hPad,
    navBarHeight,
    navBarBottom,
    navBarMaxWidth,
    isSmallPhone,
  } = useResponsive();

  const itemHeight = navBarHeight - ms(14);
  const iconSize = ms(21);

  return (
    <View
      style={[
        styles.floatingContainer,
        {
          bottom: navBarBottom,
          left: hPad,
          right: hPad,
        },
      ]}
    >
      <View
        style={[
          styles.blurBackdrop,
          {
            height: navBarHeight,
            maxWidth: navBarMaxWidth,
            borderRadius: ms(24),
            paddingHorizontal: isSmallPhone ? 4 : s(8),
          },
        ]}
      >
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
                {
                  height: itemHeight,
                  borderRadius: ms(16),
                  marginHorizontal: isSmallPhone ? 1 : s(3),
                },
                isFocused && styles.tabItemActive,
              ]}
            >
              {/* Icon Container with active iOS styling */}
              <View style={[styles.iconContainer, { height: ms(24) }]}>
                <MaterialIcons
                  name={config.icon}
                  size={iconSize}
                  color={isFocused ? ParkColors.secondary : '#8E8E93'}
                />

                {/* Optional iOS Badge (e.g. Amber EARN tag on Host) */}
                {config.badge && (
                  <View
                    style={[
                      styles.earnBadge,
                      {
                        right: isSmallPhone ? -18 : -s(22),
                        paddingHorizontal: isSmallPhone ? 3 : 4,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.earnBadgeText,
                        { fontSize: isSmallPhone ? 6.5 : ms(7.5) },
                      ]}
                    >
                      {config.badge}
                    </Text>
                  </View>
                )}
              </View>

              {/* iOS Style Typography Label */}
              <Text
                style={[
                  styles.tabLabel,
                  { fontSize: ms(10.5) },
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
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurBackdrop: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
    paddingVertical: 4,
  },
  tabItemActive: {
    backgroundColor: ParkColors.surfaceLow,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnBadge: {
    position: 'absolute',
    top: -4,
    backgroundColor: ParkColors.amberDim,
    paddingVertical: 1,
    borderRadius: 4,
  },
  earnBadgeText: {
    fontWeight: '800',
    color: '#362000',
  },
  tabLabel: {
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  tabLabelActive: {
    color: ParkColors.secondary,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: '#8E8E93', // iOS System Gray 2
  },
});
