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
import { SafeAreaView } from 'react-native-safe-area-context';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';

export default function QrScanScreen() {
  const router = useRouter();
  const { addBooking, vehicles } = useParkStore();
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [flashOn, setFlashOn] = useState(false);

  const handleSimulateScan = (codeToUse?: string) => {
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      // Create quick commercial plaza entry booking
      const newBookingId = addBooking({
        listingId: 'spot-pub-1',
        listingTitle: 'Liberty Parking Plaza',
        listingArea: 'Gulberg III, Lahore',
        listingAddress: 'Liberty Roundabout, Commercial Zone, Gulberg III, Lahore',
        listingPhoto: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
        hostName: 'Lahore Parking Company',
        hostPhoto: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80',
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
        qrCode: `SCAN-${Date.now()}`,
        pin: '7721',
        bayNumber: 'Floor 2, Bay 18',
        durationLabel: 'Active Entry Pass',
      });

      router.replace(`/booking-confirmed/${newBookingId}` as any);
    }, 1800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gate QR Scanner</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setFlashOn(!flashOn)}
          >
            <MaterialIcons
              name={flashOn ? 'flash-on' : 'flash-off'}
              size={22}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Viewfinder Center Area */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinderBox}>
            {/* 4 Corner Markers */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {isScanning ? (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator size="large" color={ParkColors.secondary} />
                <Text style={styles.scanningText}>Verifying Barrier QR...</Text>
              </View>
            ) : (
              <View style={styles.laserCenterLine} />
            )}
          </View>

          <Text style={styles.instructionText}>
            Align QR code on parking meter or barrier gate within frame.
          </Text>

          {/* Quick Simulation Trigger Button */}
          <TouchableOpacity
            style={styles.simulateScanBtn}
            activeOpacity={0.85}
            onPress={() => handleSimulateScan()}
            disabled={isScanning}
          >
            <MaterialIcons name="qr-code-scanner" size={20} color="#FFFFFF" />
            <Text style={styles.simulateScanBtnText}>
              Simulate Barrier Scan (Expo Demo)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual Code Input Drawer */}
        <View style={styles.manualCodeDrawer}>
          <Text style={styles.manualCodeTitle}>Or Enter Gate Code Manually</Text>
          <View style={styles.manualInputRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="e.g. LHR-GATE-42"
              placeholderTextColor={ParkColors.textMuted}
              value={manualCode}
              onChangeText={setManualCode}
            />
            <TouchableOpacity
              style={styles.submitCodeBtn}
              onPress={() => {
                if (manualCode.trim()) {
                  handleSimulateScan(manualCode);
                } else {
                  Alert.alert('Manual Code', 'Please enter a code to submit.');
                }
              }}
            >
              <Text style={styles.submitCodeBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewfinderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  viewfinderBox: {
    width: 250,
    height: 250,
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
    width: '90%',
    height: 2,
    backgroundColor: ParkColors.secondary,
    shadowColor: ParkColors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  scanningIndicator: {
    alignItems: 'center',
    gap: 10,
  },
  scanningText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  instructionText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
  simulateScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ParkColors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 9999,
    ...ParkShadows.md,
  },
  simulateScanBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  manualCodeDrawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ParkRadii.xl,
    borderTopRightRadius: ParkRadii.xl,
    padding: 20,
    gap: 12,
  },
  manualCodeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.text,
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  manualInput: {
    flex: 1,
    height: 48,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    paddingHorizontal: 14,
    fontSize: 14,
    color: ParkColors.text,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  submitCodeBtn: {
    paddingHorizontal: 18,
    height: 48,
    backgroundColor: ParkColors.primary,
    borderRadius: ParkRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitCodeBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
