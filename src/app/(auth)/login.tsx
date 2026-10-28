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

export default function LoginScreen() {
  const router = useRouter();
  const { user, updateUser } = useParkStore();
  const [phoneNumber, setPhoneNumber] = useState('300 8472910');

  const handleContinue = () => {
    updateUser({ phone: `+92 ${phoneNumber}` });
    router.push('/(auth)/otp' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Top Indicator */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.testModeBadge}>
              <MaterialIcons name="science" size={13} color={ParkColors.secondary} />
              <Text style={styles.testModeText}>Expo Test Mode</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.body}>
          <View style={styles.logoPill}>
            <Text style={styles.logoPillText}>P</Text>
          </View>
          <Text style={styles.headline}>Welcome to ParkYaar</Text>
          <Text style={styles.subtitle}>
            Enter your mobile number to find or list verified parking spots in Lahore.
          </Text>

          {/* Pakistani Phone Input Group */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.phoneInputRow}>
              {/* Pakistan Country Code Pill */}
              <View style={styles.countryCodeBadge}>
                <Text style={styles.flagEmoji}>🇵🇰</Text>
                <Text style={styles.countryCodeText}>+92</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="300 1234567"
                placeholderTextColor={ParkColors.textMuted}
                maxLength={12}
              />
            </View>
          </View>

          {/* Demo Helper Hint */}
          <View style={styles.hintContainer}>
            <MaterialIcons name="info-outline" size={14} color={ParkColors.textMuted} />
            <Text style={styles.hintText}>
              Any 10-digit number accepted. OTP will be prefilled with 123456.
            </Text>
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={handleContinue}
          >
            <Text style={styles.ctaButtonText}>Get Verification Code</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to ParkYaar's Community Safety & Security Policy.
          </Text>
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
    alignItems: 'flex-start',
  },
  badgeRow: {
    flexDirection: 'row',
  },
  testModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  testModeText: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  logoPill: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...ParkShadows.md,
  },
  logoPillText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
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
    marginBottom: 28,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.textMuted,
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: ParkColors.text,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: ParkColors.text,
    paddingVertical: 6,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  hintText: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  footer: {
    gap: 14,
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
  termsText: {
    fontSize: 11,
    color: ParkColors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

