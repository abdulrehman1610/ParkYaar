import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';

export default function QrScanScreen() {
  const router = useRouter();
  const { addBooking, vehicles } = useParkStore();
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [flashOn, setFlashOn] = useState(false);
  const {
    width,
    height,
    s,
    vs,
    ms,
    hPad,
    headerHeight,
    headerTopPad,
    stickyFooterBottomPad,
    formMaxWidth,
  } = useResponsive();

  const handleSimulateScan = (codeToUse?: string) => {
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const newBookingId = addBooking({
        listingId: 'spot-pub-1',
        listingTitle: 'Liberty Parking Plaza',
        listingArea: 'Gulberg III, Lahore',
        listingAddress:
          'Liberty Roundabout, Commercial Zone, Gulberg III, Lahore',
        listingPhoto:
          'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
        hostName: 'Lahore Parking Company',
        hostPhoto:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
        hostPhone: '+92 42 111 537 275',
        vehicle: vehicles[0],
        date: 'Today, 24 Oct',
        startTime: 'Just now',
        hours: 2,
        hourlyRate: 50,
        serviceFee: 10,
        discount: 0,
        total: 110,
        status: 'confirmed',
        paymentMethod: 'JazzCash Wallet (0300-******7)',
        qrCode: codeToUse || `SCAN-${Date.now()}`,
        pin: '7721',
        bayNumber: 'Floor 2, Bay 18',
        durationLabel: 'Active Entry Pass',
      });

      router.replace(`/booking-confirmed/${newBookingId}` as any);
    }, 1800);
  };

  const iconBtnSize = ms(38);
  const viewfinderSize = Math.round(
    Math.min(width * 0.62, height * 0.31, 250)
  );

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
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
            >
              <MaterialIcons name="arrow-back" size={ms(22)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontSize: ms(16.5) }]}>
              Gate QR Scanner
            </Text>
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  width: iconBtnSize,
                  height: iconBtnSize,
                  borderRadius: iconBtnSize / 2,
                },
              ]}
              onPress={() => setFlashOn(!flashOn)}
            >
              <MaterialIcons
                name={flashOn ? 'flash-on' : 'flash-off'}
                size={ms(20)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Viewfinder Center Area */}
        <View
          style={[
            styles.viewfinderContainer,
            {
              paddingHorizontal: hPad,
              gap: vs(16),
              maxWidth: formMaxWidth,
            },
          ]}
        >
          <View
            style={[
              styles.viewfinderBox,
              { width: viewfinderSize, height: viewfinderSize },
            ]}
          >
            {/* 4 Corner Markers */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {isScanning ? (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator size="large" color={ParkColors.secondary} />
                <Text style={[styles.scanningText, { fontSize: ms(13) }]}>
                  Verifying Barrier QR...
                </Text>
              </View>
            ) : (
              <View style={styles.laserCenterLine} />
            )}
          </View>

          <Text style={[styles.instructionText, { fontSize: ms(13) }]}>
            Align QR code on parking meter or barrier gate within frame.
          </Text>

          {/* Quick Simulation Trigger Button */}
          <TouchableOpacity
            style={[
              styles.simulateScanBtn,
              {
                paddingHorizontal: s(20),
                paddingVertical: vs(12),
              },
            ]}
            activeOpacity={0.85}
            onPress={() => handleSimulateScan()}
            disabled={isScanning}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={ms(19)}
              color="#FFFFFF"
            />
            <Text style={[styles.simulateScanBtnText, { fontSize: ms(13.5) }]}>
              Simulate Barrier Scan (Expo Demo)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual Code Input Drawer */}
        <View
          style={[
            styles.manualCodeOuter,
            {
              paddingBottom: stickyFooterBottomPad,
              paddingTop: vs(16),
              paddingHorizontal: hPad,
            },
          ]}
        >
          <View style={[styles.manualCodeInner, { maxWidth: formMaxWidth }]}>
            <Text style={[styles.manualCodeTitle, { fontSize: ms(13) }]}>
              Or Enter Gate Code Manually
            </Text>
            <View style={[styles.manualInputRow, { gap: s(10) }]}>
              <TextInput
                style={[
                  styles.manualInput,
                  { height: ms(46), fontSize: ms(14) },
                ]}
                placeholder="e.g. LHR-GATE-42"
                placeholderTextColor={ParkColors.textMuted}
                value={manualCode}
                onChangeText={setManualCode}
              />
              <TouchableOpacity
                style={[
                  styles.submitCodeBtn,
                  { height: ms(46), paddingHorizontal: s(18) },
                ]}
                onPress={() => {
                  if (manualCode.trim()) {
                    handleSimulateScan(manualCode);
                  } else {
                    Alert.alert(
                      'Manual Code',
                      'Please enter a code to submit.'
                    );
                  }
                }}
              >
                <Text
                  style={[styles.submitCodeBtnText, { fontSize: ms(13.5) }]}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1C30',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerOuter: {
    width: '100%',
  },
  headerInner: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewfinderContainer: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderBox: {
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: ParkColors.secondary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  laserCenterLine: {
    width: '82%',
    height: 2,
    backgroundColor: ParkColors.secondary,
    shadowColor: ParkColors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  scanningIndicator: {
    alignItems: 'center',
    gap: 10,
  },
  scanningText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.78)',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 19,
  },
  simulateScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
    ...ParkShadows.md,
  },
  simulateScanBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  manualCodeOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ParkRadii.sheet,
    borderTopRightRadius: ParkRadii.sheet,
  },
  manualCodeInner: {
    width: '100%',
    alignSelf: 'center',
    gap: 10,
  },
  manualCodeTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  manualInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manualInput: {
    flex: 1,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    fontWeight: '600',
    color: ParkColors.text,
  },
  submitCodeBtn: {
    backgroundColor: ParkColors.primary,
    borderRadius: ParkRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitCodeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
