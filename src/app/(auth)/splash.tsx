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

export default function SplashScreen() {
  const router = useRouter();
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

  return (
    <View style={styles.container}>
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
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>P</Text>
        </View>

        <Text style={styles.title}>ParkYaar</Text>
        <Text style={styles.tagline}>
          Peer-to-Peer Parking Marketplace
        </Text>
        <Text style={styles.subtext}>Urban Mobility • Lahore, Pakistan</Text>

        <View style={styles.indicatorWrapper}>
          <ActivityIndicator size="small" color={ParkColors.secondary} />
        </View>
      </Animated.View>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.replace('/(auth)/login' as any)}
      >
        <Text style={styles.skipText}>Tap to Continue</Text>
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
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...ParkShadows.lg,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: ParkColors.primary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '600',
    color: ParkColors.textVariant,
    marginTop: 8,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 13,
    color: ParkColors.textMuted,
    marginTop: 4,
  },
  indicatorWrapper: {
    marginTop: 36,
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.secondary,
  },
});

