import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkColors, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

export default function SplashScreen() {
  const router = useRouter();
  const { s, vs, ms, stickyFooterBottomPad } = useResponsive();
  const scaleAnim = new Animated.Value(0.9);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/(auth)/login' as any);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  const badgeSize = ms(82);

  return (
    <View style={[styles.container, { padding: s(24) }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Brand Emblem */}
        <View
          style={[
            styles.logoBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: ms(25),
              marginBottom: vs(20),
            },
          ]}
        >
          <Text style={[styles.logoText, { fontSize: ms(46) }]}>P</Text>
        </View>

        <Text style={[styles.title, { fontSize: ms(32) }]}>ParkYaar</Text>
        <Text style={[styles.tagline, { fontSize: ms(15), marginTop: vs(8) }]}>
          Peer-to-Peer Parking Marketplace
        </Text>
        <Text style={[styles.subtext, { fontSize: ms(13), marginTop: vs(4) }]}>
          Urban Mobility • Lahore, Pakistan
        </Text>

        <View style={{ marginTop: vs(34) }}>
          <ActivityIndicator size="small" color={ParkColors.secondary} />
        </View>
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.skipButton,
          {
            bottom: stickyFooterBottomPad + vs(16),
            paddingHorizontal: s(20),
            paddingVertical: vs(10),
          },
        ]}
        onPress={() => router.replace('/(auth)/login' as any)}
      >
        <Text style={[styles.skipText, { fontSize: ms(12) }]}>
          Tap to Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...ParkShadows.lg,
  },
  logoText: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  title: {
    fontWeight: '800',
    color: ParkColors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontWeight: '600',
    color: ParkColors.textVariant,
    textAlign: 'center',
  },
  subtext: {
    color: ParkColors.textMuted,
  },
  skipButton: {
    position: 'absolute',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
  },
  skipText: {
    fontWeight: '600',
    color: ParkColors.secondary,
  },
});
