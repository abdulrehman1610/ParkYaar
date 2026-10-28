import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DemoToolsModal } from '@/components/DemoToolsModal';
import { Header } from '@/components/Header';
import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';

export default function ProfileTabScreen() {
  const router = useRouter();
  const { user, setUserMode, vehicles, resetDemoData } = useParkStore();
  const [demoModalVisible, setDemoModalVisible] = useState(false);
  const {
    s,
    vs,
    ms,
    hPad,
    vGap,
    cardPad,
    tabScrollBottomPad,
    contentMaxWidth,
  } = useResponsive();

  const isHostMode = user.mode === 'owner';

  const handleToggleMode = (val: boolean) => {
    const nextMode = val ? 'owner' : 'seeker';
    setUserMode(nextMode);
    if (nextMode === 'owner') {
      router.push('/(tabs)/host' as any);
    } else {
      router.push('/(tabs)' as any);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Demo Data',
      'Restore all listings, bookings, and user vehicles to the fresh expo state?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Now',
          style: 'destructive',
          onPress: () => {
            resetDemoData();
            Alert.alert('Reset Complete', 'Demo state restored in < 1 second.');
          },
        },
      ]
    );
  };

  const avatarSize = ms(64);
  const menuIconSize = ms(38);

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: contentMaxWidth,
            paddingHorizontal: hPad,
            paddingTop: vGap,
            gap: vGap,
            paddingBottom: tabScrollBottomPad,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={[styles.profileCard, { padding: cardPad }]}>
          <View style={[styles.avatarRow, { gap: s(14) }]}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: user.avatar }}
                style={[
                  styles.avatar,
                  {
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: avatarSize / 2,
                  },
                ]}
              />
              {user.verified && (
                <View style={styles.verifiedShield}>
                  <MaterialIcons
                    name="verified"
                    size={ms(16)}
                    color={ParkColors.secondary}
                  />
                </View>
              )}
            </View>
            <View style={styles.nameSection}>
              <Text
                style={[styles.userName, { fontSize: ms(18) }]}
                numberOfLines={1}
              >
                {user.name}
              </Text>
              <Text style={[styles.userPhone, { fontSize: ms(13) }]}>
                {user.phone}
              </Text>
              <View style={styles.verifiedBadge}>
                <MaterialIcons
                  name="shield"
                  size={ms(13)}
                  color={ParkColors.success}
                />
                <Text style={[styles.verifiedBadgeText, { fontSize: ms(11) }]}>
                  CNIC & Licence Verified
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.cardDivider, { marginVertical: vs(14) }]} />

          <View style={styles.userStatsRow}>
            <View style={styles.userStatItem}>
              <Text style={[styles.userStatValue, { fontSize: ms(16) }]}>
                {user.rating}
              </Text>
              <Text style={[styles.userStatLabel, { fontSize: ms(11) }]}>
                Rating ★
              </Text>
            </View>
            <View style={styles.userStatItem}>
              <Text style={[styles.userStatValue, { fontSize: ms(16) }]}>
                {user.totalStays}
              </Text>
              <Text style={[styles.userStatLabel, { fontSize: ms(11) }]}>
                Total Stays
              </Text>
            </View>
            <View style={styles.userStatItem}>
              <Text style={[styles.userStatValue, { fontSize: ms(16) }]}>
                {user.memberSince}
              </Text>
              <Text style={[styles.userStatLabel, { fontSize: ms(11) }]}>
                Member Since
              </Text>
            </View>
          </View>
        </View>

        {/* Mode Switcher Banner */}
        <View style={[styles.modeCard, { padding: cardPad, gap: s(10) }]}>
          <View style={[styles.modeLeft, { gap: s(12) }]}>
            <View
              style={[
                styles.modeIconCircle,
                {
                  width: ms(42),
                  height: ms(42),
                  borderRadius: ms(21),
                },
                isHostMode && { backgroundColor: ParkColors.amberLight },
              ]}
            >
              <MaterialIcons
                name={isHostMode ? 'vpn-key' : 'explore'}
                size={ms(21)}
                color={isHostMode ? ParkColors.amber : ParkColors.secondary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modeTitle, { fontSize: ms(14) }]}>
                {isHostMode ? 'Host / Owner Mode' : 'Seeker / Driver Mode'}
              </Text>
              <Text style={[styles.modeSubtitle, { fontSize: ms(12) }]}>
                {isHostMode
                  ? 'Managing driveways & earnings'
                  : 'Searching & booking spots'}
              </Text>
            </View>
          </View>
          <Switch
            value={isHostMode}
            onValueChange={handleToggleMode}
            trackColor={{
              false: ParkColors.border,
              true: ParkColors.secondary,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Registered Vehicles Section */}
        <View style={[styles.menuCard, { padding: cardPad, gap: vs(12) }]}>
          <View style={styles.menuHeaderRow}>
            <Text style={[styles.menuHeaderTitle, { fontSize: ms(15) }]}>
              Registered Vehicles
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.addVehicleLink, { fontSize: ms(12.5) }]}>
                + Add
              </Text>
            </TouchableOpacity>
          </View>

          {vehicles.map((veh) => (
            <View
              key={veh.id}
              style={[styles.vehicleRow, { padding: s(12) }]}
            >
              <View style={[styles.vehicleRowLeft, { gap: s(10) }]}>
                <MaterialIcons
                  name={veh.type === 'bike' ? 'two-wheeler' : 'directions-car'}
                  size={ms(20)}
                  color={ParkColors.secondary}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.vehModelText, { fontSize: ms(13.5) }]}
                    numberOfLines={1}
                  >
                    {veh.model}
                  </Text>
                  <Text style={[styles.vehPlateText, { fontSize: ms(11.5) }]}>
                    {veh.plate}
                  </Text>
                </View>
              </View>
              {veh.isPrimary && (
                <View style={styles.primaryPill}>
                  <Text style={[styles.primaryPillText, { fontSize: ms(10) }]}>
                    Primary
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* App Settings & Evaluator Tools */}
        <View style={[styles.menuCard, { padding: cardPad, gap: vs(12) }]}>
          <Text style={[styles.menuHeaderTitle, { fontSize: ms(15) }]}>
            Preferences & Tools
          </Text>

          {/* Demo Tools Modal Row */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => setDemoModalVisible(true)}
          >
            <View style={[styles.menuRowLeft, { gap: s(12) }]}>
              <View
                style={[
                  styles.menuIconCircle,
                  {
                    width: menuIconSize,
                    height: menuIconSize,
                    borderRadius: menuIconSize / 2,
                    backgroundColor: ParkColors.surfaceHigh,
                  },
                ]}
              >
                <MaterialIcons
                  name="science"
                  size={ms(18)}
                  color={ParkColors.secondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuRowTitle, { fontSize: ms(14) }]}>
                  Expo Demo Tools
                </Text>
                <Text style={[styles.menuRowSubtitle, { fontSize: ms(11.5) }]}>
                  Reset data, bypass KYC, auto-approve
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={ms(20)}
              color={ParkColors.textMuted}
            />
          </TouchableOpacity>

          {/* Payment Methods */}
          <View style={styles.menuRow}>
            <View style={[styles.menuRowLeft, { gap: s(12) }]}>
              <View
                style={[
                  styles.menuIconCircle,
                  {
                    width: menuIconSize,
                    height: menuIconSize,
                    borderRadius: menuIconSize / 2,
                    backgroundColor: '#FEE2E2',
                  },
                ]}
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={ms(18)}
                  color="#D91D24"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuRowTitle, { fontSize: ms(14) }]}>
                  Payment Methods
                </Text>
                <Text style={[styles.menuRowSubtitle, { fontSize: ms(11.5) }]}>
                  JazzCash (0300-******7) linked
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={ms(20)}
              color={ParkColors.textMuted}
            />
          </View>

          {/* Help & Helpline */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Lahore Patrol Concierge',
                '24/7 dedicated support helpline: 042-111-PARK (7275)\nAll parking sessions covered under SafePark.'
              )
            }
          >
            <View style={[styles.menuRowLeft, { gap: s(12) }]}>
              <View
                style={[
                  styles.menuIconCircle,
                  {
                    width: menuIconSize,
                    height: menuIconSize,
                    borderRadius: menuIconSize / 2,
                    backgroundColor: ParkColors.surfaceLow,
                  },
                ]}
              >
                <MaterialIcons
                  name="support-agent"
                  size={ms(18)}
                  color={ParkColors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuRowTitle, { fontSize: ms(14) }]}>
                  24/7 Lahore Concierge
                </Text>
                <Text style={[styles.menuRowSubtitle, { fontSize: ms(11.5) }]}>
                  Emergency hotline & parking assistance
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={ms(20)}
              color={ParkColors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Reset Demo Data Button */}
        <TouchableOpacity
          style={[styles.resetCard, { padding: s(14) }]}
          activeOpacity={0.8}
          onPress={handleResetData}
        >
          <MaterialIcons
            name="refresh"
            size={ms(18)}
            color={ParkColors.error}
          />
          <Text style={[styles.resetCardText, { fontSize: ms(13) }]}>
            Reset Demo Data (Evaluator Reset)
          </Text>
        </TouchableOpacity>

        <Text style={[styles.versionNote, { fontSize: ms(11) }]}>
          ParkYaar MVP v1.0.0 (Lahore, PK) • University Project Expo Build
        </Text>
      </ScrollView>

      {/* Demo Tools Modal */}
      <DemoToolsModal
        visible={demoModalVisible}
        onClose={() => setDemoModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParkColors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.xl,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: ParkColors.surfaceHigh,
  },
  verifiedShield: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 1,
  },
  nameSection: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  userPhone: {
    color: ParkColors.textMuted,
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  verifiedBadgeText: {
    fontWeight: '700',
    color: ParkColors.success,
  },
  cardDivider: {
    height: 1,
    backgroundColor: ParkColors.border,
  },
  userStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userStatItem: {
    alignItems: 'center',
    gap: 2,
  },
  userStatValue: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  userStatLabel: {
    color: ParkColors.textMuted,
    fontWeight: '500',
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  modeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modeIconCircle: {
    backgroundColor: ParkColors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  modeSubtitle: {
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuHeaderTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  addVehicleLink: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.backgroundLight,
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 8,
  },
  vehicleRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehModelText: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  vehPlateText: {
    color: ParkColors.textMuted,
    fontWeight: '600',
  },
  primaryPill: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  primaryPillText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 8,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRowTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  menuRowSubtitle: {
    color: ParkColors.textMuted,
    marginTop: 1,
  },
  resetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  resetCardText: {
    fontWeight: '700',
    color: ParkColors.error,
  },
  versionNote: {
    textAlign: 'center',
    color: ParkColors.textMuted,
    marginTop: 4,
  },
});
