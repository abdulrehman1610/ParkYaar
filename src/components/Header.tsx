import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DemoToolsModal } from '@/components/DemoToolsModal';
import { ParkColors, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
}) => {
  const router = useRouter();
  const { user } = useParkStore();
  const [demoToolsVisible, setDemoToolsVisible] = useState(false);
  const {
    s,
    ms,
    hPad,
    headerHeight,
    headerTopPad,
    contentMaxWidth,
    isSmallPhone,
  } = useResponsive();

  const logoSize = ms(34);
  const avatarSize = ms(36);
  const iconBtnSize = ms(38);

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: headerTopPad }]}>
        <View
          style={[
            styles.headerContent,
            {
              height: headerHeight,
              paddingHorizontal: hPad,
              maxWidth: contentMaxWidth,
            },
          ]}
        >
          {showBack ? (
            <View style={[styles.backGroup, { gap: s(8) }]}>
              <TouchableOpacity
                onPress={onBack ? onBack : () => router.back()}
                style={[
                  styles.iconButton,
                  {
                    width: iconBtnSize,
                    height: iconBtnSize,
                    borderRadius: iconBtnSize / 2,
                  },
                ]}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={ms(22)}
                  color={ParkColors.text}
                />
              </TouchableOpacity>
              {title && (
                <Text
                  style={[styles.headerTitle, { fontSize: ms(17) }]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
              )}
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onLongPress={() => setDemoToolsVisible(true)}
              onPress={() => setDemoToolsVisible(true)}
              style={[styles.brandGroup, { gap: s(9) }]}
            >
              {/* ParkYaar Official Logo */}
              <View
                style={[
                  styles.logoBadge,
                  {
                    width: logoSize,
                    height: logoSize,
                    borderRadius: ms(10),
                  },
                ]}
              >
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.brandTextGroup}>
                <Text style={[styles.brandTitle, { fontSize: ms(16) }]}>
                  ParkYaar
                </Text>
                <View style={styles.locationDropdown}>
                  <Text style={[styles.locationText, { fontSize: ms(11) }]}>
                    Lahore, PK
                  </Text>
                  <MaterialIcons
                    name="expand-more"
                    size={ms(15)}
                    color={ParkColors.secondary}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Right Action Icons */}
          <View style={[styles.rightActions, { gap: s(10) }]}>
            <TouchableOpacity
              style={[
                styles.demoPill,
                {
                  paddingHorizontal: isSmallPhone ? 7 : s(9),
                  paddingVertical: s(5),
                  gap: s(4),
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setDemoToolsVisible(true)}
            >
              <MaterialIcons
                name="science"
                size={ms(13)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.demoPillText, { fontSize: ms(11) }]}>
                Demo
              </Text>
            </TouchableOpacity>

            {/* Profile Avatar with Verified Badge */}
            <TouchableOpacity
              style={[
                styles.avatarButton,
                {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/profile' as any)}
            >
              <Image
                source={{ uri: user.avatar }}
                style={[
                  styles.avatarImage,
                  {
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: avatarSize / 2,
                  },
                ]}
              />
              {user.verified && (
                <View style={styles.verifiedDot}>
                  <MaterialIcons
                    name="verified"
                    size={ms(13)}
                    color={ParkColors.secondary}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Live Expo Demo Controls Modal */}
      <DemoToolsModal
        visible={demoToolsVisible}
        onClose={() => setDemoToolsVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    zIndex: 50,
    ...ParkShadows.sm,
  },
  headerContent: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
    flexShrink: 1,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  logoBadge: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ParkColors.border,
    overflow: 'hidden',
    ...ParkShadows.sm,
  },
  logoImage: {
    width: '94%',
    height: '94%',
  },
  brandTextGroup: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
    letterSpacing: -0.3,
  },
  locationDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
  locationText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceHigh,
    borderRadius: 9999,
  },
  demoPillText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  avatarButton: {
    position: 'relative',
    overflow: 'visible',
  },
  avatarImage: {
    backgroundColor: ParkColors.surfaceContainer,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
});
