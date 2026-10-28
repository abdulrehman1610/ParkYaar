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
import { useParkStore } from '@/store/useParkStore';

export default function ProfileTabScreen() {
  const router = useRouter();
  const { user, setUserMode, vehicles, resetDemoData } = useParkStore();
  const [demoModalVisible, setDemoModalVisible] = useState(false);

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

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              {user.verified && (
                <View style={styles.verifiedShield}>
                  <MaterialIcons name="verified" size={16} color={ParkColors.secondary} />
                </View>
              )}
            </View>
            <View style={styles.nameSection}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="shield" size={13} color={ParkColors.success} />
                <Text style={styles.verifiedBadgeText}>CNIC & Licence Verified</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.userStatsRow}>
            <View style={styles.userStatItem}>
              <Text style={styles.userStatValue}>{user.rating}</Text>
              <Text style={styles.userStatLabel}>Rating ★</Text>
            </View>
            <View style={styles.userStatItem}>
              <Text style={styles.userStatValue}>{user.totalStays}</Text>
              <Text style={styles.userStatLabel}>Total Stays</Text>
            </View>
            <View style={styles.userStatItem}>
              <Text style={styles.userStatValue}>{user.memberSince}</Text>
              <Text style={styles.userStatLabel}>Member Since</Text>
            </View>
          </View>
        </View>

        {/* Mode Switcher Banner */}
        <View style={styles.modeCard}>
          <View style={styles.modeLeft}>
            <View
              style={[
                styles.modeIconCircle,
                isHostMode && { backgroundColor: ParkColors.amberLight },
              ]}
            >
              <MaterialIcons
                name={isHostMode ? 'vpn-key' : 'explore'}
                size={22}
                color={isHostMode ? ParkColors.amber : ParkColors.secondary}
              />
            </View>
            <View>
              <Text style={styles.modeTitle}>
                {isHostMode ? 'Host / Owner Mode' : 'Seeker / Driver Mode'}
              </Text>
              <Text style={styles.modeSubtitle}>
                {isHostMode
                  ? 'Managing driveways & earnings'
                  : 'Searching & booking spots'}
              </Text>
            </View>
          </View>
          <Switch
            value={isHostMode}
            onValueChange={handleToggleMode}
            trackColor={{ false: ParkColors.border, true: ParkColors.secondary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Registered Vehicles Section */}
        <View style={styles.menuCard}>
          <View style={styles.menuHeaderRow}>
            <Text style={styles.menuHeaderTitle}>Registered Vehicles</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.addVehicleLink}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {vehicles.map((veh) => (
            <View key={veh.id} style={styles.vehicleRow}>
              <View style={styles.vehicleRowLeft}>
                <MaterialIcons
                  name={veh.type === 'bike' ? 'two-wheeler' : 'directions-car'}
                  size={20}
                  color={ParkColors.secondary}
                />
                <View>
                  <Text style={styles.vehModelText}>{veh.model}</Text>
                  <Text style={styles.vehPlateText}>{veh.plate}</Text>
                </View>
              </View>
              {veh.isPrimary && (
                <View style={styles.primaryPill}>
                  <Text style={styles.primaryPillText}>Primary</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* App Settings & Evaluator Tools */}
        <View style={styles.menuCard}>
          <Text style={styles.menuHeaderTitle}>Preferences & Tools</Text>

          {/* Demo Tools Modal Row */}
          <TouchableOpacity
            style={styles.menuRow}
            activeOpacity={0.7}
            onPress={() => setDemoModalVisible(true)}
          >
            <View style={styles.menuRowLeft}>
              <View style={[styles.menuIconCircle, { backgroundColor: ParkColors.surfaceHigh }]}>
                <MaterialIcons name="science" size={18} color={ParkColors.secondary} />
              </View>
              <View>
                <Text style={styles.menuRowTitle}>Expo Demo Tools</Text>
                <Text style={styles.menuRowSubtitle}>Reset data, bypass KYC, auto-approve</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={ParkColors.textMuted} />
          </TouchableOpacity>

          {/* Payment Methods */}
          <View style={styles.menuRow}>
            <View style={styles.menuRowLeft}>
              <View style={[styles.menuIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="account-balance-wallet" size={18} color="#D91D24" />
              </View>
              <View>
                <Text style={styles.menuRowTitle}>Payment Methods</Text>
                <Text style={styles.menuRowSubtitle}>JazzCash (0300-******7) linked</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={ParkColors.textMuted} />
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
            <View style={styles.menuRowLeft}>
              <View style={[styles.menuIconCircle, { backgroundColor: ParkColors.surfaceLow }]}>
                <MaterialIcons name="support-agent" size={18} color={ParkColors.primary} />
              </View>
              <View>
                <Text style={styles.menuRowTitle}>24/7 Lahore Concierge</Text>
                <Text style={styles.menuRowSubtitle}>Emergency hotline & parking assistance</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={ParkColors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Reset Demo Data Button */}
        <TouchableOpacity
          style={styles.resetCard}
          activeOpacity={0.8}
          onPress={handleResetData}
        >
          <MaterialIcons name="refresh" size={18} color={ParkColors.error} />
          <Text style={styles.resetCardText}>Reset Demo Data (Evaluator Reset)</Text>
        </TouchableOpacity>

        <Text style={styles.versionNote}>
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
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ParkColors.surfaceHigh,
  },
  verifiedShield: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  nameSection: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  userPhone: {
    fontSize: 12,
    color: ParkColors.textMuted,
    marginTop: 1,
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
    marginTop: 6,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: ParkColors.success,
  },
  cardDivider: {
    height: 1,
    backgroundColor: ParkColors.border,
    marginVertical: 14,
  },
  userStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userStatItem: {
    alignItems: 'center',
  },
  userStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  userStatLabel: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  modeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modeIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  modeSubtitle: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 12,
    ...ParkShadows.sm,
  },
  menuHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  menuHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  addVehicleLink: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.surfaceLow,
    padding: 10,
    borderRadius: ParkRadii.md,
  },
  vehicleRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  vehModelText: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.text,
  },
  vehPlateText: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 1,
  },
  primaryPill: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuRowTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ParkColors.text,
  },
  menuRowSubtitle: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 1,
  },
  resetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: ParkRadii.lg,
    marginTop: 4,
  },
  resetCardText: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.error,
  },
  versionNote: {
    fontSize: 11,
    color: ParkColors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});
