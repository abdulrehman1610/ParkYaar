import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';

export default function OtpScreen() {
  const router = useRouter();
  const { user } = useParkStore();
  const [otp, setOtp] = useState('123456');

  const handleVerify = () => {
    router.push('/(auth)/verification' as any);
  };

  const digits = otp.padEnd(6, ' ').slice(0, 6).split('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Top Back & Test Mode */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={ParkColors.text} />
          </TouchableOpacity>
          <View style={styles.testBadge}>
            <Text style={styles.testBadgeText}>Prefilled: 123456</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.body}>
          <Text style={styles.headline}>Enter 6-Digit Code</Text>
          <Text style={styles.subtitle}>
            We sent a verification SMS to{' '}
            <Text style={{ fontWeight: '700', color: ParkColors.text }}>
              {user.phone || '+92 300 8472910'}
            </Text>
          </Text>

          {/* 6 Digit Display Boxes */}
          <View style={styles.otpBoxesRow}>
            {digits.map((digit, index) => (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  digit.trim() ? styles.otpBoxFilled : null,
                ]}
              >
                <Text style={styles.otpDigitText}>{digit.trim()}</Text>
              </View>
            ))}
          </View>

          {/* Hidden or real input to allow typing */}
          <TextInput
            style={styles.hiddenInput}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            autoFocus
          />

          <View style={styles.resendRow}>
            <Text style={styles.resendHint}>Didn't receive code?</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.resendLink}>Resend SMS (25s)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={handleVerify}
          >
            <Text style={styles.ctaButtonText}>Verify & Continue</Text>
            <MaterialIcons name="check" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testBadge: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  testBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: ParkColors.primary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: ParkColors.textMuted,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 32,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  otpBox: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.md,
    borderWidth: 1.5,
    borderColor: ParkColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...ParkShadows.sm,
  },
  otpBoxFilled: {
    borderColor: ParkColors.secondary,
    backgroundColor: ParkColors.surfaceLow,
  },
  otpDigitText: {
    fontSize: 22,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0.01,
    height: 56,
    width: '100%',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  resendHint: {
    fontSize: 13,
    color: ParkColors.textMuted,
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '600',
    color: ParkColors.secondary,
  },
  footer: {
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
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
});

