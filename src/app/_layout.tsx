import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { WebContainer } from '@/components/WebContainer';

export default function RootLayout() {
  return (
    <WebContainer>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="listing/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="booking/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="booking-confirmed/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="payment" options={{ presentation: 'modal' }} />
        <Stack.Screen name="public-spot/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="qr-scan" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-listing" options={{ presentation: 'modal' }} />
      </Stack>
    </WebContainer>
  );
}
