import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { ParkColors, ParkShadows } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ParkColors.secondary,
        tabBarInactiveTintColor: ParkColors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* 1. Explore Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <MaterialIcons name="explore" size={24} color={color} />
            </View>
          ),
        }}
      />

      {/* 2. Bookings Tab */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <MaterialIcons name="confirmation-number" size={24} color={color} />
            </View>
          ),
        }}
      />

      {/* 3. Host Tab with Earn Badge */}
      <Tabs.Screen
        name="host"
        options={{
          title: 'Host',
          tabBarLabel: ({ color }) => (
            <View style={styles.hostLabelRow}>
              <Text style={[styles.tabBarLabel, { color }]}>Host</Text>
              <View style={styles.earnBadge}>
                <Text style={styles.earnBadgeText}>EARN</Text>
              </View>
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <MaterialIcons name="vpn-key" size={24} color={color} />
            </View>
          ),
        }}
      />

      {/* 4. Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <MaterialIcons name="account-circle" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    height: Platform.OS === 'ios' ? 84 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    ...ParkShadows.sheet,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  iconWrapper: {
    padding: 2,
    borderRadius: 12,
  },
  iconWrapperActive: {
    backgroundColor: ParkColors.surfaceLow,
  },
  hostLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  earnBadge: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  earnBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#362000',
  },
});
