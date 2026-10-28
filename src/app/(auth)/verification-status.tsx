import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';

export default function VerificationStatusScreen() {
  const router = useRouter();
  const { approveKyc } = useParkStore();
  const [isApproved, setIsApproved] = useState(false);
  const scaleAnim = new Animated.Value(0.85);

  useEffect(() => {
    // 3-second simulated review
    const timer = setTimeout(() => {
      approveKyc();
      setIsApproved(true);

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    router.replace('/(tabs)' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!isApproved ? (
          /* Under Review State */
          <View style={styles.stateCard}>
            <View style={styles.loadingCircle}>
              <ActivityIndicator size="large" color={ParkColors.secondary} />
            </View>
            <View style={styles.testModeChip}>
              <MaterialIcons name="science" size={13} color={ParkColors.secondary} />
              <Text style={styles.testModeChipText}>NADRA Simulation • Test Mode</Text>
            </View>
            <Text style={styles.statusTitle}>Verifying Documents...</Text>
            <Text style={styles.statusDescription}>
              Matching your CNIC number, biometric selfie, and Punjab driving licence records.
            </Text>
            <Text style={styles.countdownText}>Auto-approving in ~3 seconds</Text>
          </View>
        ) : (
          /* Approved / Verified State */
          <Animated.View
            style={[
              styles.stateCard,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.approvedCircle}>
              <MaterialIcons name="verified" size={54} color="#FFFFFF" />
            </View>
            <View style={styles.verifiedBadgeRow}>
              <MaterialIcons name="shield" size={16} color={ParkColors.success} />
              <Text style={styles.verifiedBadgeText}>CNIC & Licence Verified</Text>
            </View>
            <Text style={styles.statusTitle}>You're All Set!</Text>
            <Text style={styles.statusDescription}>
              Your identity has been verified. You can now instantly reserve bays and list driveways across Lahore.
            </Text>
          </Animated.View>
        )}

        {/* Action Button */}
        <View style={styles.footer}>
          {isApproved ? (
            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.85}
              onPress={handleFinish}
            >
              <Text style={styles.ctaButtonText}>Start Exploring Lahore</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                approveKyc();
                setIsApproved(true);
              }}
            >
              <Text style={styles.skipButtonText}>Skip Wait (Expo Demo Mode)</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stateCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 340,
  },
  loadingCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: ParkColors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...ParkShadows.md,
  },
  approvedCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...ParkShadows.lg,
  },
  testModeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    marginBottom: 16,
  },
  testModeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  verifiedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: ParkColors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    marginBottom: 16,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.success,
  },
  statusTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: ParkColors.primary,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: 14,
    color: ParkColors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  countdownText: {
    fontSize: 12,
    color: ParkColors.secondary,
    fontWeight: '600',
    marginTop: 18,
  },
  footer: {
    width: '100%',
    paddingBottom: 16,
  },
  ctaButton: {
    height: 52,
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ParkShadows.md,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    height: 48,
    borderRadius: 9999,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
});
