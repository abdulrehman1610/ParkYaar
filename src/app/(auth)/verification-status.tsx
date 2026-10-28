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

import { ParkColors, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';

export default function VerificationStatusScreen() {
  const router = useRouter();
  const { approveKyc } = useParkStore();
  const [isApproved, setIsApproved] = useState(false);
  const scaleAnim = new Animated.Value(0.85);
  const {
    s,
    vs,
    ms,
    hPad,
    headerTopPad,
    stickyFooterBottomPad,
    formMaxWidth,
  } = useResponsive();

  useEffect(() => {
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

  const circleSize = ms(92);

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: headerTopPad,
          paddingBottom: stickyFooterBottomPad,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            maxWidth: formMaxWidth,
            paddingHorizontal: hPad,
          },
        ]}
      >
        {!isApproved ? (
          /* Under Review State */
          <View style={styles.stateCard}>
            <View
              style={[
                styles.loadingCircle,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  marginBottom: vs(20),
                },
              ]}
            >
              <ActivityIndicator size="large" color={ParkColors.secondary} />
            </View>
            <View style={[styles.testModeChip, { marginBottom: vs(14) }]}>
              <MaterialIcons
                name="science"
                size={ms(13)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.testModeChipText, { fontSize: ms(11) }]}>
                NADRA Simulation • Test Mode
              </Text>
            </View>
            <Text style={[styles.statusTitle, { fontSize: ms(25) }]}>
              Verifying Documents...
            </Text>
            <Text
              style={[
                styles.statusDescription,
                { fontSize: ms(14), marginTop: vs(8) },
              ]}
            >
              Matching your CNIC number, biometric selfie, and Punjab driving
              licence records.
            </Text>
            <Text
              style={[
                styles.countdownText,
                { fontSize: ms(12), marginTop: vs(16) },
              ]}
            >
              Auto-approving in ~3 seconds
            </Text>
          </View>
        ) : (
          /* Approved / Verified State */
          <Animated.View
            style={[
              styles.stateCard,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View
              style={[
                styles.approvedCircle,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  marginBottom: vs(20),
                },
              ]}
            >
              <MaterialIcons name="verified" size={ms(50)} color="#FFFFFF" />
            </View>
            <View style={[styles.verifiedBadgeRow, { marginBottom: vs(14) }]}>
              <MaterialIcons
                name="shield"
                size={ms(15)}
                color={ParkColors.success}
              />
              <Text style={[styles.verifiedBadgeText, { fontSize: ms(12) }]}>
                CNIC & Licence Verified
              </Text>
            </View>
            <Text style={[styles.statusTitle, { fontSize: ms(26) }]}>
              You&apos;re All Set!
            </Text>
            <Text
              style={[
                styles.statusDescription,
                { fontSize: ms(14), marginTop: vs(8) },
              ]}
            >
              Your identity has been verified. You can now instantly reserve
              bays and list driveways across Lahore.
            </Text>
          </Animated.View>
        )}

        {/* Action Button */}
        <View style={styles.footer}>
          {isApproved ? (
            <TouchableOpacity
              style={[styles.ctaButton, { height: ms(52) }]}
              activeOpacity={0.85}
              onPress={handleFinish}
            >
              <Text style={[styles.ctaButtonText, { fontSize: ms(16) }]}>
                Start Exploring Lahore
              </Text>
              <MaterialIcons
                name="arrow-forward"
                size={ms(20)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.skipButton, { height: ms(48) }]}
              onPress={() => {
                approveKyc();
                setIsApproved(true);
              }}
            >
              <Text style={[styles.skipButtonText, { fontSize: ms(13) }]}>
                Skip Wait (Expo Demo Mode)
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stateCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 360,
  },
  loadingCircle: {
    backgroundColor: ParkColors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    ...ParkShadows.md,
  },
  approvedCircle: {
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  testModeChipText: {
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
  },
  verifiedBadgeText: {
    fontWeight: '700',
    color: ParkColors.success,
  },
  statusTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
    textAlign: 'center',
  },
  statusDescription: {
    color: ParkColors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  countdownText: {
    color: ParkColors.secondary,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
  },
  ctaButton: {
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ParkShadows.md,
  },
  ctaButtonText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    borderRadius: 9999,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
});
