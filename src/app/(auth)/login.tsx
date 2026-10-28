import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';

export default function LoginScreen() {
  const router = useRouter();
  const { updateUser } = useParkStore();
  const [phoneNumber, setPhoneNumber] = useState('300 8472910');
  const {
    s,
    vs,
    ms,
    hPad,
    cardPad,
    headerTopPad,
    stickyFooterBottomPad,
    formMaxWidth,
  } = useResponsive();

  const handleContinue = () => {
    updateUser({ phone: `+92 ${phoneNumber}` });
    router.push('/(auth)/otp' as any);
  };

  const logoSize = ms(52);

  return (
    <View style={[styles.safeArea, { paddingTop: headerTopPad }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              maxWidth: formMaxWidth,
              paddingHorizontal: hPad,
              paddingTop: vs(12),
              paddingBottom: stickyFooterBottomPad,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Indicator */}
          <View style={styles.header}>
            <View style={styles.testModeBadge}>
              <MaterialIcons
                name="science"
                size={ms(13)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.testModeText, { fontSize: ms(11) }]}>
                Expo Test Mode
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={[styles.body, { paddingVertical: vs(24) }]}>
            <View
              style={[
                styles.logoPill,
                {
                  width: logoSize,
                  height: logoSize,
                  borderRadius: ms(16),
                  marginBottom: vs(18),
                },
              ]}
            >
              <Text style={[styles.logoPillText, { fontSize: ms(26) }]}>P</Text>
            </View>
            <Text style={[styles.headline, { fontSize: ms(26) }]}>
              Welcome to ParkYaar
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: ms(14),
                  marginTop: vs(8),
                  marginBottom: vs(24),
                },
              ]}
            >
              Enter your mobile number to find or list verified parking spots in
              Lahore.
            </Text>

            {/* Pakistani Phone Input Group */}
            <View style={[styles.inputCard, { padding: cardPad }]}>
              <Text style={[styles.inputLabel, { fontSize: ms(12) }]}>
                Mobile Number
              </Text>
              <View style={[styles.phoneInputRow, { gap: s(10) }]}>
                {/* Pakistan Country Code Pill */}
                <View
                  style={[
                    styles.countryCodeBadge,
                    {
                      height: ms(46),
                      paddingHorizontal: s(12),
                      gap: s(6),
                    },
                  ]}
                >
                  <Text style={{ fontSize: ms(16) }}>🇵🇰</Text>
                  <Text style={[styles.countryCodeText, { fontSize: ms(14) }]}>
                    +92
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.phoneInput,
                    { height: ms(46), fontSize: ms(16) },
                  ]}
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
            <View style={[styles.hintContainer, { marginTop: vs(12) }]}>
              <MaterialIcons
                name="info-outline"
                size={ms(14)}
                color={ParkColors.textMuted}
              />
              <Text style={[styles.hintText, { fontSize: ms(12) }]}>
                Any 10-digit number accepted. OTP will be prefilled with 123456.
              </Text>
            </View>
          </View>

          {/* Bottom CTA */}
          <View style={[styles.footer, { gap: vs(12) }]}>
            <TouchableOpacity
              style={[styles.ctaButton, { height: ms(52) }]}
              activeOpacity={0.85}
              onPress={handleContinue}
            >
              <Text style={[styles.ctaButtonText, { fontSize: ms(16) }]}>
                Get Verification Code
              </Text>
              <MaterialIcons
                name="arrow-forward"
                size={ms(20)}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={[styles.termsText, { fontSize: ms(11.5) }]}>
              By continuing, you agree to ParkYaar&apos;s Community Safety &
              Security Policy.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
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
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  logoPill: {
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...ParkShadows.md,
  },
  logoPillText: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headline: {
    fontWeight: '800',
    color: ParkColors.primary,
    letterSpacing: -0.4,
  },
  subtitle: {
    color: ParkColors.textMuted,
    lineHeight: 20,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  inputLabel: {
    fontWeight: '600',
    color: ParkColors.textMuted,
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  countryCodeText: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
    borderRadius: ParkRadii.md,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    fontWeight: '700',
    color: ParkColors.text,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintText: {
    color: ParkColors.textMuted,
    flex: 1,
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
  termsText: {
    color: ParkColors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
