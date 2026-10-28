import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';
import { VehicleType } from '@/types';

type PaymentMethod = 'jazzcash' | 'easypaisa' | 'card';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addBooking, vehicles } = useParkStore();

  const [method, setMethod] = useState<PaymentMethod>('jazzcash');
  const [processing, setProcessing] = useState(false);

  const total = params.total ? Number(params.total) : 430;
  const hours = params.hours ? Number(params.hours) : 3;
  const hourlyRate = params.hourlyRate ? Number(params.hourlyRate) : 150;
  const serviceFee = params.serviceFee ? Number(params.serviceFee) : 30;
  const discount = params.discount ? Number(params.discount) : 50;

  const handlePay = () => {
    setProcessing(true);

    setTimeout(() => {
      // Find vehicle
      const selectedVeh =
        vehicles.find((v) => v.id === params.vehicleId) || vehicles[0];

      const paymentMethodLabel =
        method === 'jazzcash'
          ? 'JazzCash Wallet (0300-******7)'
          : method === 'easypaisa'
          ? 'Easypaisa (0321-******2)'
          : 'Debit Card (ending in 8842)';

      const bookingId = addBooking({
        listingId: (params.listingId as string) || 'spot-1',
        listingTitle: (params.listingTitle as string) || 'Covered Garage near Liberty Market',
        listingArea: (params.listingArea as string) || 'Gulberg III, Lahore',
        listingAddress: (params.listingAddress as string) || 'House 42-B, Sector B-3, Gulberg III, Lahore',
        listingPhoto: (params.listingPhoto as string) || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
        hostName: (params.hostName as string) || 'Sana Malik',
        hostPhoto: (params.hostPhoto as string) || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        hostPhone: (params.hostPhone as string) || '+92 300 8472910',
        vehicle: selectedVeh,
        date: (params.date as string) || 'Today, 24 Oct',
        startTime: (params.startTime as string) || '03:00 PM',
        hours,
        hourlyRate,
        serviceFee,
        discount,
        total,
        status: 'confirmed',
        paymentMethod: paymentMethodLabel,
        qrCode: '',
        pin: '',
        bayNumber: (params.bayNumber as string) || 'Bay A-1',
        durationLabel: (params.durationLabel as string) || 'Today, 3:00 - 6:00 PM',
      });

      setProcessing(false);
      router.replace(`/booking-confirmed/${bookingId}` as any);
    }, 1800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            disabled={processing}
          >
            <MaterialIcons name="close" size={24} color={ParkColors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Payment Method</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {/* Test Mode Sandbox Banner */}
          <View style={styles.sandboxBanner}>
            <MaterialIcons name="science" size={18} color={ParkColors.secondary} />
            <View style={styles.sandboxTextGroup}>
              <Text style={styles.sandboxTitle}>Sandbox Mode • Test Checkout</Text>
              <Text style={styles.sandboxDesc}>
                No real PKR will be charged to your mobile wallet or bank account.
              </Text>
            </View>
          </View>

          {/* Amount Due Box */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total Payable</Text>
            <Text style={styles.amountValue}>Rs {total}</Text>
            <Text style={styles.amountSpot}>
              For {params.listingTitle || 'Covered Garage near Liberty'}
            </Text>
          </View>

          {/* Payment Method Radio Options */}
          <View style={styles.methodsList}>
            <Text style={styles.methodsTitle}>Payment Options (Pakistan)</Text>

            {/* 1. JazzCash */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                method === 'jazzcash' && styles.methodCardSelected,
              ]}
              activeOpacity={0.85}
              onPress={() => setMethod('jazzcash')}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.walletLogo, { backgroundColor: '#D91D24' }]}>
                  <Text style={styles.walletLogoText}>JC</Text>
                </View>
                <View>
                  <View style={styles.methodTitleRow}>
                    <Text style={styles.methodName}>JazzCash Mobile Account</Text>
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>POPULAR</Text>
                    </View>
                  </View>
                  <Text style={styles.methodSubtitle}>0300-8472910 • Instant Debit</Text>
                </View>
              </View>
              <View style={[styles.radioCircle, method === 'jazzcash' && styles.radioCircleSelected]}>
                {method === 'jazzcash' && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>

            {/* 2. Easypaisa */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                method === 'easypaisa' && styles.methodCardSelected,
              ]}
              activeOpacity={0.85}
              onPress={() => setMethod('easypaisa')}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.walletLogo, { backgroundColor: '#00B14F' }]}>
                  <Text style={styles.walletLogoText}>EP</Text>
                </View>
                <View>
                  <Text style={styles.methodName}>Easypaisa Wallet</Text>
                  <Text style={styles.methodSubtitle}>0321-4455667 • Telenor Microfinance</Text>
                </View>
              </View>
              <View style={[styles.radioCircle, method === 'easypaisa' && styles.radioCircleSelected]}>
                {method === 'easypaisa' && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>

            {/* 3. Debit / Credit Card */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                method === 'card' && styles.methodCardSelected,
              ]}
              activeOpacity={0.85}
              onPress={() => setMethod('card')}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.walletLogo, { backgroundColor: ParkColors.primary }]}>
                  <MaterialIcons name="credit-card" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.methodName}>Debit / Credit Card</Text>
                  <Text style={styles.methodSubtitle}>Visa / Mastercard / PayPak / 1LINK</Text>
                </View>
              </View>
              <View style={[styles.radioCircle, method === 'card' && styles.radioCircleSelected]}>
                {method === 'card' && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.payBtn, processing && styles.payBtnDisabled]}
            activeOpacity={0.88}
            onPress={handlePay}
            disabled={processing}
          >
            {processing ? (
              <View style={styles.processingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.payBtnText}>Simulating Payment Gateway...</Text>
              </View>
            ) : (
              <View style={styles.processingRow}>
                <MaterialIcons name="lock" size={18} color="#FFFFFF" />
                <Text style={styles.payBtnText}>Confirm & Pay Rs {total}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.securityFooterText}>
            🔒 256-bit SSL encrypted • SBP regulated sandbox protocol
          </Text>
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
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    backgroundColor: '#FFFFFF',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  sandboxBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ParkColors.surfaceHigh,
    padding: 12,
    borderRadius: ParkRadii.lg,
  },
  sandboxTextGroup: {
    flex: 1,
  },
  sandboxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  sandboxDesc: {
    fontSize: 11,
    color: ParkColors.textVariant,
    lineHeight: 15,
    marginTop: 1,
  },
  amountBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.textMuted,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '900',
    color: ParkColors.primary,
    marginTop: 4,
  },
  amountSpot: {
    fontSize: 12,
    color: ParkColors.textVariant,
    marginTop: 4,
    textAlign: 'center',
  },
  methodsList: {
    gap: 10,
  },
  methodsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
    marginBottom: 2,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  methodCardSelected: {
    borderColor: ParkColors.secondary,
    backgroundColor: ParkColors.surfaceLow,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  walletLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  methodName: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.text,
  },
  popularBadge: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  popularBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#291800',
  },
  methodSubtitle: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ParkColors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: ParkColors.secondary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ParkColors.secondary,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    gap: 10,
  },
  payBtn: {
    height: 52,
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...ParkShadows.md,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  securityFooterText: {
    fontSize: 11,
    color: ParkColors.textMuted,
    textAlign: 'center',
  },
});
