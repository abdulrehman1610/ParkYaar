import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';

export default function BookingScheduleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { listings, vehicles, selectedVehicleId, setSelectedVehicleId } = useParkStore();

  const spot = listings.find((l) => l.id === id) || listings[0];

  const [selectedDate, setSelectedDate] = useState('Today, 24 Oct');
  const [arrivalTime, setArrivalTime] = useState('03:00 PM');
  const [hours, setHours] = useState(3);
  const [instantQrPass, setInstantQrPass] = useState(true);

  // Calculations
  const ratePerHour = spot.pricePerHour;
  const baseFare = hours * ratePerHour;
  const serviceFee = 30;
  const promoDiscount = 50;
  const total = Math.max(0, baseFare + serviceFee - promoDiscount);

  // Departure time calculation
  const startHour = 15; // 3 PM
  const endHour = (startHour + hours) % 24;
  const endPeriod = endHour >= 12 ? 'PM' : 'AM';
  const displayHour = endHour % 12 || 12;
  const departureFormatted = `${displayHour < 10 ? '0' : ''}${displayHour}:00 ${endPeriod}`;

  const handleContinueToPayment = () => {
    const selectedVeh =
      vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

    // Navigate to payment modal with booking parameters
    router.push({
      pathname: '/payment',
      params: {
        listingId: spot.id,
        listingTitle: spot.title,
        listingArea: spot.area,
        listingAddress: spot.address,
        listingPhoto: spot.photos[0],
        hostName: spot.hostName,
        hostPhoto: spot.hostPhoto,
        hostPhone: '+92 300 8472910',
        vehicleId: selectedVeh.id,
        vehicleModel: selectedVeh.model,
        vehiclePlate: selectedVeh.plate,
        vehicleType: selectedVeh.type,
        date: selectedDate,
        startTime: arrivalTime,
        hours: hours.toString(),
        hourlyRate: ratePerHour.toString(),
        serviceFee: serviceFee.toString(),
        discount: promoDiscount.toString(),
        total: total.toString(),
        bayNumber: 'Bay A-1',
        durationLabel: `${selectedDate.split(',')[0]}, 3:00 - ${departureFormatted}`,
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={ParkColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Spot Summary Banner */}
        <View style={styles.spotSummaryCard}>
          <Image source={{ uri: spot.photos[0] }} style={styles.spotThumbnail} />
          <View style={styles.spotSummaryInfo}>
            <View style={styles.verifiedTag}>
              <MaterialIcons name="verified" size={12} color={ParkColors.secondary} />
              <Text style={styles.verifiedTagText}>Verified Spot</Text>
            </View>
            <Text style={styles.spotSummaryTitle} numberOfLines={1}>
              {spot.title}
            </Text>
            <Text style={styles.spotSummaryHost}>Host: {spot.hostName}</Text>
            <Text style={styles.spotSummaryPrice}>
              Rs {spot.pricePerHour}
              <Text style={styles.spotSummaryPriceUnit}>/hr</Text>
            </Text>
          </View>
        </View>

        {/* Vehicle Selector Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Your Vehicle</Text>
            <Text style={styles.stepLabel}>Step 1 of 2</Text>
          </View>

          <View style={styles.vehicleList}>
            {vehicles.map((veh) => {
              const isSelected = veh.id === selectedVehicleId;
              return (
                <TouchableOpacity
                  key={veh.id}
                  style={[
                    styles.vehicleCard,
                    isSelected && styles.vehicleCardSelected,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedVehicleId(veh.id)}
                >
                  <View style={styles.vehicleCardLeft}>
                    <View
                      style={[
                        styles.vehicleIconCircle,
                        isSelected && styles.vehicleIconCircleSelected,
                      ]}
                    >
                      <MaterialIcons
                        name={veh.type === 'bike' ? 'two-wheeler' : 'directions-car'}
                        size={24}
                        color={isSelected ? ParkColors.secondary : ParkColors.textMuted}
                      />
                    </View>
                    <View style={styles.vehicleInfo}>
                      <View style={styles.vehicleModelRow}>
                        <Text style={styles.vehicleModel}>{veh.model}</Text>
                        {veh.isPrimary && (
                          <View style={styles.primaryBadge}>
                            <MaterialIcons name="check-circle" size={10} color={ParkColors.secondary} />
                            <Text style={styles.primaryBadgeText}>Primary</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.plateRow}>
                        <View style={styles.punjabPlate}>
                          <Text style={styles.punjabPlateText}>{veh.plate}</Text>
                        </View>
                        <Text style={styles.vehicleTypeTag}>
                          {veh.type.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Radio Indicator */}
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Schedule Arrival Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule Arrival</Text>

          {/* Date Chips Rail */}
          <View style={styles.dateRail}>
            {['Today, 24 Oct', 'Tomorrow, 25 Oct', 'Sat, 26 Oct'].map((dateOption) => {
              const isSelected = selectedDate === dateOption;
              return (
                <TouchableOpacity
                  key={dateOption}
                  style={[
                    styles.dateChip,
                    isSelected && styles.dateChipSelected,
                  ]}
                  onPress={() => setSelectedDate(dateOption)}
                >
                  {isSelected && (
                    <MaterialIcons name="calendar-today" size={14} color="#FFFFFF" />
                  )}
                  <Text
                    style={[
                      styles.dateChipText,
                      isSelected && styles.dateChipTextSelected,
                    ]}
                  >
                    {dateOption}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Time & Stepper Box */}
          <View style={styles.timeStepperBox}>
            {/* Arrival Time Row */}
            <View style={styles.arrivalTimeRow}>
              <View style={styles.timeIconText}>
                <View style={styles.timeIconCircle}>
                  <MaterialIcons name="schedule" size={18} color={ParkColors.secondary} />
                </View>
                <View>
                  <Text style={styles.timeLabel}>Arrival Time</Text>
                  <Text style={styles.timeValue}>{arrivalTime}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.changeTimeBtn}
                onPress={() => {
                  const times = ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
                  const nextIdx = (times.indexOf(arrivalTime) + 1) % times.length;
                  setArrivalTime(times[nextIdx]);
                }}
              >
                <Text style={styles.changeTimeText}>Change</Text>
                <MaterialIcons name="expand-more" size={14} color={ParkColors.secondary} />
              </TouchableOpacity>
            </View>

            {/* Stepper Control */}
            <View style={styles.stepperContainer}>
              <View style={styles.stepperTop}>
                <Text style={styles.stepperLabel}>Parking Duration</Text>
                <View style={styles.stepperControl}>
                  <TouchableOpacity
                    style={[styles.stepperBtn, hours <= 1 && styles.stepperBtnDisabled]}
                    onPress={() => setHours((h) => Math.max(1, h - 1))}
                    disabled={hours <= 1}
                  >
                    <MaterialIcons name="remove" size={18} color={ParkColors.text} />
                  </TouchableOpacity>
                  <Text style={styles.stepperCount}>
                    {hours} {hours === 1 ? 'Hour' : 'Hours'}
                  </Text>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() => setHours((h) => Math.min(24, h + 1))}
                  >
                    <MaterialIcons name="add" size={18} color={ParkColors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.departureRow}>
                <MaterialIcons name="update" size={14} color={ParkColors.secondary} />
                <Text style={styles.departureText}>
                  Until {departureFormatted} {selectedDate.includes('Today') ? 'today' : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Instant QR Entry Pass Toggle */}
        <View style={styles.qrPassCard}>
          <View style={styles.qrPassLeft}>
            <View style={styles.qrPassIconCircle}>
              <MaterialIcons name="qr-code-2" size={22} color={ParkColors.secondary} />
            </View>
            <View style={styles.qrPassText}>
              <View style={styles.qrPassTitleRow}>
                <Text style={styles.qrPassTitle}>Instant QR Entry Pass</Text>
                <View style={styles.fastTag}>
                  <Text style={styles.fastTagText}>FAST</Text>
                </View>
              </View>
              <Text style={styles.qrPassSubtitle}>
                Host approved automatic camera sync. Scan upon arrival at Gulberg entrance.
              </Text>
            </View>
          </View>
          <Switch
            value={instantQrPass}
            onValueChange={setInstantQrPass}
            trackColor={{ false: ParkColors.border, true: ParkColors.secondary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Fare Summary Breakdown */}
        <View style={styles.fareCard}>
          <View style={styles.fareHeader}>
            <Text style={styles.fareTitle}>Fare Summary</Text>
            <View style={styles.guaranteedBadge}>
              <MaterialIcons name="verified-user" size={12} color={ParkColors.secondary} />
              <Text style={styles.guaranteedText}>100% Guaranteed</Text>
            </View>
          </View>

          <View style={styles.fareRows}>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>
                Base parking ({hours} hrs × Rs {ratePerHour})
              </Text>
              <Text style={styles.fareValue}>Rs {baseFare}</Text>
            </View>

            <View style={styles.fareRow}>
              <View style={styles.feeLabelGroup}>
                <Text style={styles.fareLabel}>Platform service fee</Text>
                <MaterialIcons name="info-outline" size={13} color={ParkColors.textMuted} />
              </View>
              <Text style={styles.fareValue}>Rs {serviceFee}</Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Security & insurance guarantee</Text>
              <Text style={styles.fareFreeValue}>Free (Included)</Text>
            </View>

            {/* Promo Code Applied */}
            <View style={styles.promoCard}>
              <View style={styles.promoLeft}>
                <MaterialIcons name="local-activity" size={16} color={ParkColors.secondary} />
                <Text style={styles.promoCodeText}>PKFIRST applied</Text>
              </View>
              <Text style={styles.promoDiscountText}>-Rs {promoDiscount}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Total Payable */}
          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalTitle}>Total Payable</Text>
              <Text style={styles.taxInclusive}>Inclusive of all local taxes</Text>
            </View>
            <Text style={styles.totalAmount}>Rs {total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity
          style={styles.payButton}
          activeOpacity={0.88}
          onPress={handleContinueToPayment}
        >
          <MaterialIcons name="lock" size={18} color="#FFFFFF" />
          <Text style={styles.payButtonText}>
            Continue to Payment • Rs {total}
          </Text>
        </TouchableOpacity>
        <View style={styles.cancellationRow}>
          <MaterialIcons name="schedule" size={13} color={ParkColors.secondary} />
          <Text style={styles.cancellationText}>
            Free cancellation up to 15 mins before arrival
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParkColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 120,
  },
  spotSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  spotThumbnail: {
    width: 72,
    height: 72,
    borderRadius: ParkRadii.md,
    backgroundColor: ParkColors.surfaceHigh,
  },
  spotSummaryInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  spotSummaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  spotSummaryHost: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  spotSummaryPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: ParkColors.secondary,
    marginTop: 2,
  },
  spotSummaryPriceUnit: {
    fontSize: 11,
    fontWeight: '400',
    color: ParkColors.textMuted,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ParkColors.text,
  },
  stepLabel: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  vehicleList: {
    gap: 10,
  },
  vehicleCard: {
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
  vehicleCardSelected: {
    borderColor: ParkColors.secondary,
    backgroundColor: ParkColors.surfaceLow,
  },
  vehicleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  vehicleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleIconCircleSelected: {
    backgroundColor: ParkColors.surfaceHigh,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleModelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleModel: {
    fontSize: 14,
    fontWeight: '700',
    color: ParkColors.text,
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  punjabPlate: {
    backgroundColor: ParkColors.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  punjabPlateText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  vehicleTypeTag: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: ParkColors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: ParkColors.secondary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ParkColors.secondary,
  },
  dateRail: {
    flexDirection: 'row',
    gap: 8,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  dateChipSelected: {
    backgroundColor: ParkColors.primary,
    borderColor: ParkColors.primary,
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.text,
  },
  dateChipTextSelected: {
    color: '#FFFFFF',
  },
  timeStepperBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 14,
    ...ParkShadows.sm,
  },
  arrivalTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLabel: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '700',
    color: ParkColors.text,
  },
  changeTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  changeTimeText: {
    fontSize: 11,
    fontWeight: '600',
    color: ParkColors.secondary,
  },
  stepperContainer: {
    backgroundColor: ParkColors.surfaceLow,
    padding: 12,
    borderRadius: ParkRadii.md,
    gap: 8,
  },
  stepperTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: ParkColors.text,
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    padding: 3,
    ...ParkShadows.sm,
  },
  stepperBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ParkColors.surfaceLow,
  },
  stepperBtnDisabled: {
    opacity: 0.35,
  },
  stepperCount: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.primary,
    paddingHorizontal: 12,
  },
  departureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  departureText: {
    fontSize: 12,
    color: ParkColors.textMuted,
  },
  qrPassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  qrPassLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  qrPassIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ParkColors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPassText: {
    flex: 1,
  },
  qrPassTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qrPassTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.text,
  },
  fastTag: {
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  fastTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: ParkColors.secondary,
  },
  qrPassSubtitle: {
    fontSize: 11,
    color: ParkColors.textMuted,
    lineHeight: 15,
    marginTop: 2,
  },
  fareCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 12,
    ...ParkShadows.sm,
  },
  fareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  fareTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ParkColors.text,
  },
  guaranteedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guaranteedText: {
    fontSize: 11,
    fontWeight: '600',
    color: ParkColors.secondary,
  },
  fareRows: {
    gap: 8,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fareLabel: {
    fontSize: 13,
    color: ParkColors.textMuted,
  },
  fareValue: {
    fontSize: 13,
    fontWeight: '600',
    color: ParkColors.text,
  },
  fareFreeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.surfaceLow,
    padding: 8,
    borderRadius: ParkRadii.sm,
    marginTop: 4,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promoCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.text,
  },
  promoDiscountText: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: ParkColors.border,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  taxInclusive: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 1,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: ParkColors.primary,
  },
  stickyFooter: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
    ...ParkShadows.sheet,
  },
  payButton: {
    height: 52,
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ParkShadows.md,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancellationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cancellationText: {
    fontSize: 11,
    color: ParkColors.textMuted,
  },
});
