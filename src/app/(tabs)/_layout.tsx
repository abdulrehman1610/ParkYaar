import { Tabs } from 'expo-router';
import React from 'react';

import { IosTabBar } from '@/components/IosTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <IosTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
        }}
      />
      <Tabs.Screen
        name="host"
        options={{
          title: 'Host',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
