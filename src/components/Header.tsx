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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DemoToolsModal } from '@/components/DemoToolsModal';
import { ParkColors, ParkShadows } from '@/constants/theme';
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
  showSearch = true,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useParkStore();
  const [demoToolsVisible, setDemoToolsVisible] = useState(false);

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.headerContent}>
          {showBack ? (
            <View style={styles.backGroup}>
              <TouchableOpacity
                onPress={onBack ? onBack : () => router.back()}
                style={styles.iconButton}
                activeOpacity={0.7}
              >
                <MaterialIcons name="arrow-back" size={24} color={ParkColors.text} />
              </TouchableOpacity>
              {title && <Text style={styles.headerTitle}>{title}</Text>}
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onLongPress={() => setDemoToolsVisible(true)}
              onPress={() => setDemoToolsVisible(true)}
              style={styles.brandGroup}
            >
              {/* ParkYaar Badge/Logo */}
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>P</Text>
              </View>
              <View style={styles.brandTextGroup}>
                <Text style={styles.brandTitle}>ParkYaar</Text>
                <View style={styles.locationDropdown}>
                  <Text style={styles.locationText}>Lahore, PK</Text>
                  <MaterialIcons name="expand-more" size={16} color={ParkColors.secondary} />
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Right Action Icons */}
          <View style={styles.rightActions}>
            <TouchableOpacity
              style={styles.demoPill}
              activeOpacity={0.7}
              onPress={() => setDemoToolsVisible(true)}
            >
              <MaterialIcons name="science" size={13} color={ParkColors.secondary} />
              <Text style={styles.demoPillText}>Demo</Text>
            </TouchableOpacity>

            {/* Profile Avatar with Verified Badge */}
            <TouchableOpacity
              style={styles.avatarButton}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/profile' as any)}
            >
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatarImage}
              />
              {user.verified && (
                <View style={styles.verifiedDot}>
                  <MaterialIcons name="verified" size={14} color={ParkColors.secondary} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    zIndex: 50,
    ...ParkShadows.sm,
  },
  headerContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...ParkShadows.sm,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  brandTextGroup: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontSize: 16,
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
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  avatarButton: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'visible',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
