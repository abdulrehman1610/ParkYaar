import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';

interface DemoToolsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const DemoToolsModal: React.FC<DemoToolsModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    resetDemoData,
    skipVerification,
    autoApproveRequests,
    toggleAutoApproveRequests,
    user,
    setUserMode,
  } = useParkStore();

  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleReset = () => {
    resetDemoData();
    setResetMessage('All demo data restored to initial state!');
    setTimeout(() => {
      setResetMessage(null);
      onClose();
    }, 900);
  };

  const handleSkipKyc = () => {
    skipVerification();
    Alert.alert('KYC Bypassed', 'User is now marked as CNIC & Licence Verified.');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="build" size={20} color={ParkColors.secondary} />
              </View>
              <View>
                <Text style={styles.title}>Expo Demo Controls</Text>
                <Text style={styles.subtitle}>Fast evaluator testing & resets</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="close" size={24} color={ParkColors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Alert feedback */}
          {resetMessage && (
            <View style={styles.feedbackBanner}>
              <MaterialIcons name="check-circle" size={16} color={ParkColors.success} />
              <Text style={styles.feedbackText}>{resetMessage}</Text>
            </View>
          )}

          {/* Quick Actions List */}
          <View style={styles.actionsList}>
            {/* Action 1: Reset Demo Data */}
            <TouchableOpacity
              style={styles.actionRow}
              activeOpacity={0.7}
              onPress={handleReset}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <MaterialIcons name="restart-alt" size={22} color={ParkColors.error} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Reset Demo Data</Text>
                <Text style={styles.actionDescription}>
                  Restores clean state (10 spots, 2 vehicles, 2 past bookings) in &lt; 1s.
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={ParkColors.textMuted} />
            </TouchableOpacity>

            {/* Action 2: Skip KYC Verification */}
            <TouchableOpacity
              style={styles.actionRow}
              activeOpacity={0.7}
              onPress={handleSkipKyc}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: ParkColors.surfaceHigh }]}>
                <MaterialIcons name="verified-user" size={22} color={ParkColors.secondary} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Skip KYC Verification</Text>
                <Text style={styles.actionDescription}>
                  Status: {user.verified ? 'Already Verified' : 'Unverified (Tap to verify)'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={ParkColors.textMuted} />
            </TouchableOpacity>

            {/* Action 3: Auto-Approve Requests Toggle */}
            <View style={styles.actionRow}>
              <View style={[styles.actionIconCircle, { backgroundColor: ParkColors.amberLight }]}>
                <MaterialIcons name="bolt" size={22} color={ParkColors.amber} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Auto-Approve Requests</Text>
                <Text style={styles.actionDescription}>
                  Automatically confirms booking requests without manual host tap.
                </Text>
              </View>
              <Switch
                value={autoApproveRequests}
                onValueChange={toggleAutoApproveRequests}
                trackColor={{ false: ParkColors.border, true: ParkColors.secondary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Action 4: Quick Mode Switch */}
            <TouchableOpacity
              style={styles.actionRow}
              activeOpacity={0.7}
              onPress={() => {
                const newMode = user.mode === 'seeker' ? 'owner' : 'seeker';
                setUserMode(newMode);
                onClose();
              }}
            >
              <View style={[styles.actionIconCircle, { backgroundColor: ParkColors.surfaceLow }]}>
                <MaterialIcons name="swap-horiz" size={22} color={ParkColors.primary} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Switch Active Mode</Text>
                <Text style={styles.actionDescription}>
                  Currently in: <Text style={{ fontWeight: '700' }}>{user.mode.toUpperCase()}</Text> mode.
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={ParkColors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Test Mode Disclaimer */}
          <View style={styles.disclaimerBox}>
            <MaterialIcons name="info-outline" size={16} color={ParkColors.textMuted} />
            <Text style={styles.disclaimerText}>
              University Expo Demo Mode: NADRA identity validation and banking payment gateways are simulated.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 37, 69, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.xl,
    padding: 20,
    ...ParkShadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ParkColors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: ParkColors.textMuted,
    marginTop: 1,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ParkColors.successLight,
    padding: 10,
    borderRadius: ParkRadii.md,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 13,
    color: ParkColors.success,
    fontWeight: '600',
  },
  actionsList: {
    gap: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: ParkColors.backgroundLight,
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 12,
  },
  actionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ParkColors.text,
  },
  actionDescription: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 2,
    lineHeight: 15,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
  },
  disclaimerText: {
    fontSize: 11,
    color: ParkColors.textMuted,
    flex: 1,
    lineHeight: 14,
  },
});
