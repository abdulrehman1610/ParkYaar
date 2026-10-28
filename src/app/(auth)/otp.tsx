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

export default function OtpScreen() {
  const router = useRouter();
  const { user } = useParkStore();
  const [otp, setOtp] = useState('123456');
  const {
    s,
    vs,
    ms,
    hPad,
    headerTopPad,
    stickyFooterBottomPad,
    formMaxWidth,
    isSmallPhone,
  } = useResponsive();

  const handleVerify = () => {
    router.push('/(auth)/verification' as any);
  };

  const digits = otp.padEnd(6, ' ').slice(0, 6).split('');
  const iconBtnSize = ms(38);
  const boxHeight = ms(54);

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
          {/* Top Back & Test Mode */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  width: iconBtnSize,
                  height: iconBtnSize,
                  borderRadius: iconBtnSize / 2,
                },
              ]}
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back"
                size={ms(22)}
                color={ParkColors.text}
              />
            </TouchableOpacity>
            <View style={styles.testBadge}>
              <Text style={[styles.testBadgeText, { fontSize: ms(11) }]}>
                Prefilled: 123456
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={[styles.body, { paddingVertical: vs(24) }]}>
            <Text style={[styles.headline, { fontSize: ms(26) }]}>
              Enter 6-Digit Code
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: ms(14),
                  marginTop: vs(8),
                  marginBottom: vs(28),
                },
              ]}
            >
              We sent a verification SMS to{' '}
              <Text style={{ fontWeight: '700', color: ParkColors.text }}>
                {user.phone || '+92 300 8472910'}
              </Text>
            </Text>

            {/* 6 Digit Display Boxes */}
            <View style={{ position: 'relative' }}>
              <View
                style={[
                  styles.otpBoxesRow,
                  {
                    gap: isSmallPhone ? 5 : s(8),
                    marginBottom: vs(18),
                  },
                ]}
              >
                {digits.map((digit, index) => (
                  <View
                    key={index}
                    style={[
                      styles.otpBox,
                      { height: boxHeight },
                      digit.trim() ? styles.otpBoxFilled : null,
                    ]}
                  >
                    <Text style={[styles.otpDigitText, { fontSize: ms(21) }]}>
                      {digit.trim()}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Hidden or real input to allow typing */}
              <TextInput
                style={[styles.hiddenInput, { height: boxHeight }]}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                autoFocus
              />
            </View>

            <View style={styles.resendRow}>
              <Text style={[styles.resendHint, { fontSize: ms(13) }]}>
                Didn&apos;t receive code?
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[styles.resendLink, { fontSize: ms(13) }]}>
                  Resend SMS (25s)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom CTA */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.ctaButton, { height: ms(52) }]}
              activeOpacity={0.85}
              onPress={handleVerify}
            >
              <Text style={[styles.ctaButtonText, { fontSize: ms(16) }]}>
                Verify & Continue
              </Text>
              <MaterialIcons name="check" size={ms(20)} color="#FFFFFF" />
            </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
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
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
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
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox: {
    flex: 1,
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
    fontWeight: '700',
    color: ParkColors.primary,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.01,
    width: '100%',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  resendHint: {
    color: ParkColors.textMuted,
  },
  resendLink: {
    fontWeight: '600',
    color: ParkColors.secondary,
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
});
