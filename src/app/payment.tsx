import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';
import { VehicleType } from '@/types';

type PaymentMethod = 'jazzcash' | 'easypaisa' | 'card';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addBooking, vehicles } = useParkStore();
  const {
    s,
    vs,
    ms,
    hPad,
    vGap,
    cardPad,
    headerHeight,
    headerTopPad,
    stickyFooterBottomPad,
    formMaxWidth,
  } = useResponsive();

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
      const selectedVeh =
        vehicles.find((v) => v.id === params.vehicleId) ||
        ({
          id: (params.vehicleId as string) || 'veh-1',
          model: (params.vehicleModel as string) || 'Honda Civic',
          plate: (params.vehiclePlate as string) || 'LEA-22-4812',
          type: (params.vehicleType as VehicleType) || 'car',
        } as any);

      const methodLabel =
        method === 'jazzcash'
          ? 'JazzCash Wallet (0300-******7)'
          : method === 'easypaisa'
          ? 'Easypaisa Wallet (0333-******1)'
          : 'Visa Debit Card (•••• 4242)';

      const bookingId = addBooking({
        listingId: (params.listingId as string) || 'spot-1',
        listingTitle:
          (params.listingTitle as string) || 'Covered Garage near Liberty',
        listingArea: (params.listingArea as string) || 'Gulberg III',
        listingAddress:
          (params.listingAddress as string) ||
          'House 42-B, Main Boulevard, Gulberg III, Lahore',
        listingPhoto:
          (params.listingPhoto as string) ||
          'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
        hostName: (params.hostName as string) || 'Tariq Mahmood',
        hostPhoto:
          (params.hostPhoto as string) ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
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
        paymentMethod: methodLabel,
        qrCode: `PKY-${Date.now()}`,
        pin: '4892',
        bayNumber: (params.bayNumber as string) || 'Bay A-1',
        durationLabel:
          (params.durationLabel as string) || 'Today, 3:00 - 6:00 PM',
      });

      setProcessing(false);
      router.replace(`/booking-confirmed/${bookingId}` as any);
    }, 1800);
  };

  const iconBtnSize = ms(38);
  const logoSize = ms(44);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.headerOuter, { paddingTop: headerTopPad }]}>
        <View
          style={[
            styles.headerInner,
            {
              height: headerHeight,
              paddingHorizontal: hPad,
              maxWidth: formMaxWidth,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                width: iconBtnSize,
                height: iconBtnSize,
                borderRadius: iconBtnSize / 2,
              },
            ]}
            onPress={() => router.back()}
            disabled={processing}
          >
            <MaterialIcons
              name="close"
              size={ms(22)}
              color={ParkColors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: ms(16.5) }]}>
            Select Payment Method
          </Text>
          <View style={{ width: iconBtnSize }} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: formMaxWidth,
            paddingHorizontal: hPad,
            paddingTop: vGap,
            gap: vGap,
            paddingBottom: vs(30),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mock Mode Alert */}
        <View style={[styles.sandboxBanner, { padding: cardPad, gap: s(10) }]}>
          <MaterialIcons
            name="verified-user"
            size={ms(18)}
            color={ParkColors.secondary}
          />
          <View style={styles.sandboxTextGroup}>
            <Text style={[styles.sandboxTitle, { fontSize: ms(12.5) }]}>
              Sandbox Mode • Test Checkout
            </Text>
            <Text style={[styles.sandboxDesc, { fontSize: ms(11.5) }]}>
              No real PKR will be charged to your mobile wallet or bank account.
            </Text>
          </View>
        </View>

        {/* Amount Due Box */}
        <View style={[styles.amountBox, { padding: s(20) }]}>
          <Text style={[styles.amountLabel, { fontSize: ms(12) }]}>
            Total Payable
          </Text>
          <Text style={[styles.amountValue, { fontSize: ms(32) }]}>
            Rs {total}
          </Text>
          <Text
            style={[styles.amountSpot, { fontSize: ms(12.5) }]}
            numberOfLines={1}
          >
            For {params.listingTitle || 'Covered Garage near Liberty'}
          </Text>
        </View>

        {/* Payment Method Radio Options */}
        <View style={[styles.methodsList, { gap: vs(10) }]}>
          <Text style={[styles.methodsTitle, { fontSize: ms(15) }]}>
            Payment Options (Pakistan)
          </Text>

          {/* 1. JazzCash */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              { padding: cardPad },
              method === 'jazzcash' && styles.methodCardSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => setMethod('jazzcash')}
          >
            <View style={[styles.methodLeft, { gap: s(12) }]}>
              <View
                style={[
                  styles.walletLogo,
                  {
                    width: logoSize,
                    height: logoSize,
                    borderRadius: ms(12),
                    backgroundColor: '#D91D24',
                  },
                ]}
              >
                <Text style={[styles.walletLogoText, { fontSize: ms(15) }]}>
                  JC
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.methodTitleRow}>
                  <Text
                    style={[styles.methodName, { fontSize: ms(14) }]}
                    numberOfLines={1}
                  >
                    JazzCash Mobile Account
                  </Text>
                  <View style={styles.popularBadge}>
                    <Text style={[styles.popularBadgeText, { fontSize: ms(9) }]}>
                      POPULAR
                    </Text>
                  </View>
                </View>
                <Text style={[styles.methodSubtitle, { fontSize: ms(11.5) }]}>
                  0300-8472910 • Instant Debit
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.radioCircle,
                method === 'jazzcash' && styles.radioCircleSelected,
              ]}
            >
              {method === 'jazzcash' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          {/* 2. Easypaisa */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              { padding: cardPad },
              method === 'easypaisa' && styles.methodCardSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => setMethod('easypaisa')}
          >
            <View style={[styles.methodLeft, { gap: s(12) }]}>
              <View
                style={[
                  styles.walletLogo,
                  {
                    width: logoSize,
                    height: logoSize,
                    borderRadius: ms(12),
                    backgroundColor: '#00B14F',
                  },
                ]}
              >
                <Text style={[styles.walletLogoText, { fontSize: ms(15) }]}>
                  EP
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.methodTitleRow}>
                  <Text
                    style={[styles.methodName, { fontSize: ms(14) }]}
                    numberOfLines={1}
                  >
                    Easypaisa Mobile Account
                  </Text>
                </View>
                <Text style={[styles.methodSubtitle, { fontSize: ms(11.5) }]}>
                  0333-1234567 • Instant Debit
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.radioCircle,
                method === 'easypaisa' && styles.radioCircleSelected,
              ]}
            >
              {method === 'easypaisa' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>

          {/* 3. Debit / Credit Card */}
          <TouchableOpacity
            style={[
              styles.methodCard,
              { padding: cardPad },
              method === 'card' && styles.methodCardSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => setMethod('card')}
          >
            <View style={[styles.methodLeft, { gap: s(12) }]}>
              <View
                style={[
                  styles.walletLogo,
                  {
                    width: logoSize,
                    height: logoSize,
                    borderRadius: ms(12),
                    backgroundColor: ParkColors.primary,
                  },
                ]}
              >
                <MaterialIcons
                  name="credit-card"
                  size={ms(20)}
                  color="#FFFFFF"
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.methodTitleRow}>
                  <Text
                    style={[styles.methodName, { fontSize: ms(14) }]}
                    numberOfLines={1}
                  >
                    PayPak / Visa / Mastercard
                  </Text>
                </View>
                <Text style={[styles.methodSubtitle, { fontSize: ms(11.5) }]}>
                  Pakistani & International Cards
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.radioCircle,
                method === 'card' && styles.radioCircleSelected,
              ]}
            >
              {method === 'card' && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View
        style={[
          styles.footerOuter,
          {
            paddingBottom: stickyFooterBottomPad,
            paddingTop: vs(12),
            paddingHorizontal: hPad,
          },
        ]}
      >
        <View style={[styles.footerInner, { maxWidth: formMaxWidth }]}>
          <TouchableOpacity
            style={[
              styles.payBtn,
              { height: ms(50) },
              processing && styles.payBtnDisabled,
            ]}
            activeOpacity={0.88}
            onPress={handlePay}
            disabled={processing}
          >
            {processing ? (
              <View style={styles.processingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.payBtnText, { fontSize: ms(15) }]}>
                  Simulating Payment Gateway...
                </Text>
              </View>
            ) : (
              <View style={styles.processingRow}>
                <MaterialIcons name="lock" size={ms(18)} color="#FFFFFF" />
                <Text style={[styles.payBtnText, { fontSize: ms(15) }]}>
                  Confirm & Pay Rs {total}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.securityFooterText, { fontSize: ms(11) }]}>
            🔒 256-bit SSL encrypted • SBP regulated sandbox protocol
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
    justifyContent: 'space-between',
  },
  headerOuter: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    backgroundColor: '#FFFFFF',
  },
  headerInner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
  sandboxBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  sandboxTextGroup: {
    flex: 1,
    gap: 2,
  },
  sandboxTitle: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  sandboxDesc: {
    color: ParkColors.textMuted,
  },
  amountBox: {
    backgroundColor: ParkColors.primary,
    borderRadius: ParkRadii.xl,
    alignItems: 'center',
    gap: 4,
    ...ParkShadows.md,
  },
  amountLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
  amountValue: {
    fontWeight: '900',
    color: '#FFFFFF',
  },
  amountSpot: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  methodsList: {
    width: '100%',
  },
  methodsTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
    marginBottom: 2,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
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
    flex: 1,
  },
  walletLogo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLogoText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  methodName: {
    fontWeight: '700',
    color: ParkColors.primary,
    flexShrink: 1,
  },
  popularBadge: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularBadgeText: {
    fontWeight: '800',
    color: '#523400',
  },
  methodSubtitle: {
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
  footerOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
  },
  footerInner: {
    width: '100%',
    alignSelf: 'center',
    gap: 8,
  },
  payBtn: {
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
    fontWeight: '700',
    color: '#FFFFFF',
  },
  securityFooterText: {
    color: ParkColors.textMuted,
    textAlign: 'center',
  },
});
