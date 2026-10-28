import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
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

  const { height, s, vs, ms, hPad } = useResponsive();
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
    Alert.alert(
      'KYC Bypassed',
      'User is now marked as CNIC & Licence Verified.'
    );
    onClose();
  };

  const iconSize = ms(40);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { padding: hPad }]}>
        <View
          style={[
            styles.modalCard,
            {
              padding: s(18),
              maxHeight: height * 0.88,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { marginBottom: vs(14) }]}>
            <View style={[styles.titleRow, { gap: s(12) }]}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    width: iconSize,
                    height: iconSize,
                    borderRadius: iconSize / 2,
                  },
                ]}
              >
                <MaterialIcons
                  name="build"
                  size={ms(20)}
                  color={ParkColors.secondary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { fontSize: ms(16.5) }]}>
                  Expo Demo Controls
                </Text>
                <Text style={[styles.subtitle, { fontSize: ms(12) }]}>
                  Fast evaluator testing & resets
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name="close"
                size={ms(24)}
                color={ParkColors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Alert feedback */}
            {resetMessage && (
              <View style={styles.feedbackBanner}>
                <MaterialIcons
                  name="check-circle"
                  size={ms(16)}
                  color={ParkColors.success}
                />
                <Text style={[styles.feedbackText, { fontSize: ms(12.5) }]}>
                  {resetMessage}
                </Text>
              </View>
            )}

            {/* Quick Actions List */}
            <View style={[styles.actionsList, { gap: vs(10) }]}>
              {/* Action 1: Reset Demo Data */}
              <TouchableOpacity
                style={[styles.actionRow, { padding: s(12), gap: s(12) }]}
                activeOpacity={0.7}
                onPress={handleReset}
              >
                <View
                  style={[
                    styles.actionIconCircle,
                    {
                      width: iconSize,
                      height: iconSize,
                      borderRadius: iconSize / 2,
                      backgroundColor: '#FEE2E2',
                    },
                  ]}
                >
                  <MaterialIcons
                    name="restart-alt"
                    size={ms(21)}
                    color={ParkColors.error}
                  />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={[styles.actionTitle, { fontSize: ms(14) }]}>
                    Reset Demo Data
                  </Text>
                  <Text
                    style={[styles.actionDescription, { fontSize: ms(11.5) }]}
                  >
                    Restores clean state (10 spots, 2 vehicles, 2 past bookings)
                    in &lt; 1s.
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={ms(20)}
                  color={ParkColors.textMuted}
                />
              </TouchableOpacity>

              {/* Action 2: Skip KYC Verification */}
              <TouchableOpacity
                style={[styles.actionRow, { padding: s(12), gap: s(12) }]}
                activeOpacity={0.7}
                onPress={handleSkipKyc}
              >
                <View
                  style={[
                    styles.actionIconCircle,
                    {
                      width: iconSize,
                      height: iconSize,
                      borderRadius: iconSize / 2,
                      backgroundColor: ParkColors.surfaceHigh,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="verified-user"
                    size={ms(21)}
                    color={ParkColors.secondary}
                  />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={[styles.actionTitle, { fontSize: ms(14) }]}>
                    Skip KYC Verification
                  </Text>
                  <Text
                    style={[styles.actionDescription, { fontSize: ms(11.5) }]}
                  >
                    Status:{' '}
                    {user.verified
                      ? 'Already Verified'
                      : 'Unverified (Tap to verify)'}
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={ms(20)}
                  color={ParkColors.textMuted}
                />
              </TouchableOpacity>

              {/* Action 3: Auto-Approve Requests Toggle */}
              <View style={[styles.actionRow, { padding: s(12), gap: s(12) }]}>
                <View
                  style={[
                    styles.actionIconCircle,
                    {
                      width: iconSize,
                      height: iconSize,
                      borderRadius: iconSize / 2,
                      backgroundColor: ParkColors.amberLight,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="bolt"
                    size={ms(21)}
                    color={ParkColors.amber}
                  />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={[styles.actionTitle, { fontSize: ms(14) }]}>
                    Auto-Approve Requests
                  </Text>
                  <Text
                    style={[styles.actionDescription, { fontSize: ms(11.5) }]}
                  >
                    Automatically confirms booking requests without manual host
                    tap.
                  </Text>
                </View>
                <Switch
                  value={autoApproveRequests}
                  onValueChange={toggleAutoApproveRequests}
                  trackColor={{
                    false: ParkColors.border,
                    true: ParkColors.secondary,
                  }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Action 4: Quick Mode Switch */}
              <TouchableOpacity
                style={[styles.actionRow, { padding: s(12), gap: s(12) }]}
                activeOpacity={0.7}
                onPress={() => {
                  const newMode = user.mode === 'seeker' ? 'owner' : 'seeker';
                  setUserMode(newMode);
                  onClose();
                }}
              >
                <View
                  style={[
                    styles.actionIconCircle,
                    {
                      width: iconSize,
                      height: iconSize,
                      borderRadius: iconSize / 2,
                      backgroundColor: ParkColors.surfaceLow,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="swap-horiz"
                    size={ms(21)}
                    color={ParkColors.primary}
                  />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={[styles.actionTitle, { fontSize: ms(14) }]}>
                    Switch Active Mode
                  </Text>
                  <Text
                    style={[styles.actionDescription, { fontSize: ms(11.5) }]}
                  >
                    Currently in:{' '}
                    <Text style={{ fontWeight: '700' }}>
                      {user.mode.toUpperCase()}
                    </Text>{' '}
                    mode.
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={ms(20)}
                  color={ParkColors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Test Mode Disclaimer */}
            <View
              style={[
                styles.disclaimerBox,
                { padding: s(12), marginTop: vs(14) },
              ]}
            >
              <MaterialIcons
                name="info-outline"
                size={ms(16)}
                color={ParkColors.textMuted}
              />
              <Text style={[styles.disclaimerText, { fontSize: ms(11) }]}>
                University Expo Demo Mode: NADRA identity validation and banking
                payment gateways are simulated.
              </Text>
            </View>
          </ScrollView>
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
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.xl,
    ...ParkShadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    backgroundColor: ParkColors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  subtitle: {
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
    color: ParkColors.success,
    fontWeight: '600',
  },
  actionsList: {
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.backgroundLight,
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  actionIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  actionDescription: {
    color: ParkColors.textMuted,
    lineHeight: 16,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
  },
  disclaimerText: {
    flex: 1,
    color: ParkColors.textMuted,
    lineHeight: 15,
  },
});
