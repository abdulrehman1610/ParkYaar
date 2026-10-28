import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
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

export default function BookingScheduleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings, vehicles, selectedVehicleId, setSelectedVehicleId } =
    useParkStore();
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
    isSmallPhone,
  } = useResponsive();

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

  const iconBtnSize = ms(38);
  const thumbSize = ms(74);

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
          >
            <MaterialIcons
              name="arrow-back"
              size={ms(22)}
              color={ParkColors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: ms(16.5) }]}>
            Schedule Booking
          </Text>
          <View style={{ width: iconBtnSize }} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            maxWidth: formMaxWidth,
            paddingHorizontal: hPad,
            paddingTop: vGap,
            gap: vGap,
            paddingBottom: vs(130),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Spot Summary Banner */}
        <View style={[styles.spotSummaryCard, { padding: cardPad, gap: s(12) }]}>
          <Image
            source={{ uri: spot.photos[0] }}
            style={[
              styles.spotThumbnail,
              { width: thumbSize, height: thumbSize },
            ]}
          />
          <View style={styles.spotSummaryInfo}>
            <View style={styles.verifiedTag}>
              <MaterialIcons
                name="verified"
                size={ms(12)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.verifiedTagText, { fontSize: ms(10.5) }]}>
                Verified Spot
              </Text>
            </View>
            <Text
              style={[styles.spotSummaryTitle, { fontSize: ms(15) }]}
              numberOfLines={1}
            >
              {spot.title}
            </Text>
            <Text style={[styles.spotSummaryHost, { fontSize: ms(12) }]}>
              Host: {spot.hostName}
            </Text>
            <Text style={[styles.spotSummaryPrice, { fontSize: ms(15.5) }]}>
              Rs {spot.pricePerHour}
              <Text style={[styles.spotSummaryPriceUnit, { fontSize: ms(11) }]}>
                /hr
              </Text>
            </Text>
          </View>
        </View>

        {/* Vehicle Selector Section */}
        <View style={[styles.section, { gap: vs(10) }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: ms(16) }]}>
              Select Your Vehicle
            </Text>
            <Text style={[styles.stepLabel, { fontSize: ms(11.5) }]}>
              Step 1 of 2
            </Text>
          </View>

          <View style={[styles.vehicleList, { gap: vs(10) }]}>
            {vehicles.map((veh) => {
              const isSelected = veh.id === selectedVehicleId;
              return (
                <TouchableOpacity
                  key={veh.id}
                  style={[
                    styles.vehicleCard,
                    { padding: cardPad },
                    isSelected && styles.vehicleCardSelected,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedVehicleId(veh.id)}
                >
                  <View style={[styles.vehicleCardLeft, { gap: s(12) }]}>
                    <View
                      style={[
                        styles.vehicleIconCircle,
                        {
                          width: ms(44),
                          height: ms(44),
                          borderRadius: ms(22),
                        },
                        isSelected && styles.vehicleIconCircleSelected,
                      ]}
                    >
                      <MaterialIcons
                        name={
                          veh.type === 'bike'
                            ? 'two-wheeler'
                            : 'directions-car'
                        }
                        size={ms(22)}
                        color={
                          isSelected
                            ? ParkColors.secondary
                            : ParkColors.textMuted
                        }
                      />
                    </View>
                    <View style={styles.vehicleInfo}>
                      <View style={styles.vehicleModelRow}>
                        <Text
                          style={[styles.vehicleModel, { fontSize: ms(14) }]}
                          numberOfLines={1}
                        >
                          {veh.model}
                        </Text>
                        {veh.isPrimary && (
                          <View style={styles.primaryBadge}>
                            <MaterialIcons
                              name="check-circle"
                              size={ms(10)}
                              color={ParkColors.secondary}
                            />
                            <Text
                              style={[
                                styles.primaryBadgeText,
                                { fontSize: ms(10) },
                              ]}
                            >
                              Primary
                            </Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.plateRow}>
                        <View style={styles.punjabPlate}>
                          <Text
                            style={[
                              styles.punjabPlateText,
                              { fontSize: ms(11) },
                            ]}
                          >
                            {veh.plate}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.vehicleTypeTag,
                            { fontSize: ms(10.5) },
                          ]}
                        >
                          {veh.type.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Radio Indicator */}
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Schedule Arrival Section */}
        <View style={[styles.section, { gap: vs(10) }]}>
          <Text style={[styles.sectionTitle, { fontSize: ms(16) }]}>
            Schedule Arrival
          </Text>

          {/* Date Chips Rail */}
          <View style={[styles.dateRail, { gap: s(8) }]}>
            {['Today, 24 Oct', 'Tomorrow, 25 Oct', 'Sat, 26 Oct'].map(
              (dateOption) => {
                const isSelected = selectedDate === dateOption;
                return (
                  <TouchableOpacity
                    key={dateOption}
                    style={[
                      styles.dateChip,
                      {
                        paddingVertical: vs(9),
                        paddingHorizontal: isSmallPhone ? 6 : s(10),
                      },
                      isSelected && styles.dateChipSelected,
                    ]}
                    onPress={() => setSelectedDate(dateOption)}
                  >
                    {isSelected && (
                      <MaterialIcons
                        name="calendar-today"
                        size={ms(13)}
                        color="#FFFFFF"
                      />
                    )}
                    <Text
                      style={[
                        styles.dateChipText,
                        { fontSize: ms(11.5) },
                        isSelected && styles.dateChipTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {dateOption}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          {/* Time & Stepper Box */}
          <View style={[styles.timeStepperBox, { padding: cardPad, gap: vs(14) }]}>
            {/* Arrival Time Row */}
            <View style={styles.arrivalTimeRow}>
              <View style={[styles.timeIconText, { gap: s(10) }]}>
                <View
                  style={[
                    styles.timeIconCircle,
                    {
                      width: ms(38),
                      height: ms(38),
                      borderRadius: ms(19),
                    },
                  ]}
                >
                  <MaterialIcons
                    name="schedule"
                    size={ms(18)}
                    color={ParkColors.secondary}
                  />
                </View>
                <View>
                  <Text style={[styles.timeLabel, { fontSize: ms(11) }]}>
                    Arrival Time
                  </Text>
                  <Text style={[styles.timeValue, { fontSize: ms(15) }]}>
                    {arrivalTime}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.changeTimeBtn,
                  { paddingHorizontal: s(12), paddingVertical: vs(6) },
                ]}
                onPress={() => {
                  const times = [
                    '01:00 PM',
                    '02:00 PM',
                    '03:00 PM',
                    '04:00 PM',
                    '05:00 PM',
                  ];
                  const nextIdx =
                    (times.indexOf(arrivalTime) + 1) % times.length;
                  setArrivalTime(times[nextIdx]);
                }}
              >
                <Text style={[styles.changeTimeText, { fontSize: ms(12) }]}>
                  Change
                </Text>
                <MaterialIcons
                  name="expand-more"
                  size={ms(14)}
                  color={ParkColors.secondary}
                />
              </TouchableOpacity>
            </View>

            {/* Stepper Control */}
            <View style={[styles.stepperContainer, { paddingTop: vs(12) }]}>
              <View style={styles.stepperTop}>
                <Text style={[styles.stepperLabel, { fontSize: ms(13.5) }]}>
                  Parking Duration
                </Text>
                <View style={[styles.stepperControl, { gap: s(10) }]}>
                  <TouchableOpacity
                    style={[
                      styles.stepperBtn,
                      {
                        width: ms(34),
                        height: ms(34),
                        borderRadius: ms(17),
                      },
                      hours <= 1 && styles.stepperBtnDisabled,
                    ]}
                    onPress={() => setHours((h) => Math.max(1, h - 1))}
                    disabled={hours <= 1}
                  >
                    <MaterialIcons
                      name="remove"
                      size={ms(17)}
                      color={ParkColors.text}
                    />
                  </TouchableOpacity>
                  <Text style={[styles.stepperCount, { fontSize: ms(14) }]}>
                    {hours} {hours === 1 ? 'Hour' : 'Hours'}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.stepperBtn,
                      {
                        width: ms(34),
                        height: ms(34),
                        borderRadius: ms(17),
                      },
                    ]}
                    onPress={() => setHours((h) => Math.min(24, h + 1))}
                  >
                    <MaterialIcons
                      name="add"
                      size={ms(17)}
                      color={ParkColors.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.departureRow}>
                <MaterialIcons
                  name="update"
                  size={ms(14)}
                  color={ParkColors.secondary}
                />
                <Text style={[styles.departureText, { fontSize: ms(12) }]}>
                  Until {departureFormatted}{' '}
                  {selectedDate.includes('Today') ? 'today' : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Instant QR Entry Pass Toggle */}
        <View style={[styles.qrPassCard, { padding: cardPad, gap: s(10) }]}>
          <View style={[styles.qrPassLeft, { gap: s(12) }]}>
            <View
              style={[
                styles.qrPassIconCircle,
                {
                  width: ms(42),
                  height: ms(42),
                  borderRadius: ms(21),
                },
              ]}
            >
              <MaterialIcons
                name="qr-code-2"
                size={ms(21)}
                color={ParkColors.secondary}
              />
            </View>
            <View style={styles.qrPassText}>
              <View style={styles.qrPassTitleRow}>
                <Text style={[styles.qrPassTitle, { fontSize: ms(13.5) }]}>
                  Instant QR Entry Pass
                </Text>
                <View style={styles.fastTag}>
                  <Text style={[styles.fastTagText, { fontSize: ms(9.5) }]}>
                    FAST
                  </Text>
                </View>
              </View>
              <Text style={[styles.qrPassSubtitle, { fontSize: ms(11.5) }]}>
                Host approved automatic camera sync. Scan upon arrival at
                Gulberg entrance.
              </Text>
            </View>
          </View>
          <Switch
            value={instantQrPass}
            onValueChange={setInstantQrPass}
            trackColor={{
              false: ParkColors.border,
              true: ParkColors.secondary,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Fare Summary Breakdown */}
        <View style={[styles.fareCard, { padding: cardPad, gap: vs(12) }]}>
          <View style={styles.fareHeader}>
            <Text style={[styles.fareTitle, { fontSize: ms(15.5) }]}>
              Fare Summary
            </Text>
            <View style={styles.guaranteedBadge}>
              <MaterialIcons
                name="verified-user"
                size={ms(12)}
                color={ParkColors.secondary}
              />
              <Text style={[styles.guaranteedText, { fontSize: ms(10.5) }]}>
                100% Guaranteed
              </Text>
            </View>
          </View>

          <View style={[styles.fareRows, { gap: vs(8) }]}>
            <View style={styles.fareRow}>
              <Text style={[styles.fareLabel, { fontSize: ms(12.5) }]}>
                Base parking ({hours} hrs × Rs {ratePerHour})
              </Text>
              <Text style={[styles.fareValue, { fontSize: ms(13) }]}>
                Rs {baseFare}
              </Text>
            </View>

            <View style={styles.fareRow}>
              <View style={styles.feeLabelGroup}>
                <Text style={[styles.fareLabel, { fontSize: ms(12.5) }]}>
                  Platform service fee
                </Text>
                <MaterialIcons
                  name="info-outline"
                  size={ms(13)}
                  color={ParkColors.textMuted}
                />
              </View>
              <Text style={[styles.fareValue, { fontSize: ms(13) }]}>
                Rs {serviceFee}
              </Text>
            </View>

            <View style={styles.fareRow}>
              <Text style={[styles.fareLabel, { fontSize: ms(12.5) }]}>
                Security & insurance guarantee
              </Text>
              <Text style={[styles.fareFreeValue, { fontSize: ms(12.5) }]}>
                Free (Included)
              </Text>
            </View>

            {/* Promo Code Applied */}
            <View style={[styles.promoCard, { padding: s(10) }]}>
              <View style={styles.promoLeft}>
                <MaterialIcons
                  name="local-activity"
                  size={ms(15)}
                  color={ParkColors.secondary}
                />
                <Text style={[styles.promoCodeText, { fontSize: ms(12) }]}>
                  PKFIRST applied
                </Text>
              </View>
              <Text style={[styles.promoDiscountText, { fontSize: ms(12.5) }]}>
                -Rs {promoDiscount}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Total Payable */}
          <View style={styles.totalRow}>
            <View>
              <Text style={[styles.totalTitle, { fontSize: ms(15) }]}>
                Total Payable
              </Text>
              <Text style={[styles.taxInclusive, { fontSize: ms(11) }]}>
                Inclusive of all local taxes
              </Text>
            </View>
            <Text style={[styles.totalAmount, { fontSize: ms(21) }]}>
              Rs {total}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.stickyFooterOuter,
          {
            paddingBottom: stickyFooterBottomPad,
            paddingTop: vs(12),
            paddingHorizontal: hPad,
          },
        ]}
      >
        <View style={[styles.stickyFooterInner, { maxWidth: formMaxWidth }]}>
          <TouchableOpacity
            style={[styles.payButton, { height: ms(50) }]}
            activeOpacity={0.88}
            onPress={handleContinueToPayment}
          >
            <MaterialIcons name="lock" size={ms(18)} color="#FFFFFF" />
            <Text style={[styles.payButtonText, { fontSize: ms(15) }]}>
              Continue to Payment • Rs {total}
            </Text>
          </TouchableOpacity>
          <View style={styles.cancellationRow}>
            <MaterialIcons
              name="schedule"
              size={ms(13)}
              color={ParkColors.secondary}
            />
            <Text style={[styles.cancellationText, { fontSize: ms(11) }]}>
              Free cancellation up to 15 mins before arrival
            </Text>
          </View>
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
  headerOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
    ...ParkShadows.sm,
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
  scrollContent: {
    width: '100%',
    alignSelf: 'center',
  },
  spotSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  spotThumbnail: {
    borderRadius: ParkRadii.md,
    backgroundColor: ParkColors.surfaceHigh,
  },
  spotSummaryInfo: {
    flex: 1,
    gap: 2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  verifiedTagText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  spotSummaryTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  spotSummaryHost: {
    color: ParkColors.textMuted,
  },
  spotSummaryPrice: {
    fontWeight: '800',
    color: ParkColors.primary,
    marginTop: 2,
  },
  spotSummaryPriceUnit: {
    fontWeight: '500',
    color: ParkColors.textMuted,
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  stepLabel: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  vehicleList: {
    width: '100%',
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
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
    flex: 1,
  },
  vehicleIconCircle: {
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleIconCircleSelected: {
    backgroundColor: ParkColors.surfaceHigh,
  },
  vehicleInfo: {
    flex: 1,
    gap: 4,
  },
  vehicleModelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  vehicleModel: {
    fontWeight: '700',
    color: ParkColors.primary,
    flexShrink: 1,
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.surfaceHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  primaryBadgeText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  punjabPlate: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  punjabPlateText: {
    fontWeight: '800',
    color: ParkColors.primary,
    letterSpacing: 0.5,
  },
  vehicleTypeTag: {
    fontWeight: '700',
    color: ParkColors.textMuted,
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
  dateRail: {
    flexDirection: 'row',
  },
  dateChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  dateChipSelected: {
    backgroundColor: ParkColors.secondary,
    borderColor: ParkColors.secondary,
  },
  dateChipText: {
    fontWeight: '600',
    color: ParkColors.text,
  },
  dateChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timeStepperBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
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
  },
  timeIconCircle: {
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLabel: {
    color: ParkColors.textMuted,
    fontWeight: '500',
  },
  timeValue: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  changeTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
  },
  changeTimeText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  stepperContainer: {
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    gap: 8,
  },
  stepperTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    backgroundColor: ParkColors.surfaceLow,
    borderWidth: 1,
    borderColor: ParkColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  stepperCount: {
    fontWeight: '800',
    color: ParkColors.primary,
    minWidth: 64,
    textAlign: 'center',
  },
  departureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  departureText: {
    color: ParkColors.secondary,
    fontWeight: '600',
  },
  qrPassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  qrPassLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  qrPassIconCircle: {
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPassText: {
    flex: 1,
    gap: 2,
  },
  qrPassTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qrPassTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  fastTag: {
    backgroundColor: ParkColors.amberDim,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  fastTagText: {
    fontWeight: '800',
    color: '#523400',
  },
  qrPassSubtitle: {
    color: ParkColors.textMuted,
    lineHeight: 16,
  },
  fareCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  fareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fareTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  guaranteedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  guaranteedText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  fareRows: {
    width: '100%',
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fareLabel: {
    color: ParkColors.textMuted,
  },
  fareValue: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  fareFreeValue: {
    fontWeight: '700',
    color: ParkColors.success,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    marginTop: 2,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promoCodeText: {
    fontWeight: '700',
    color: ParkColors.secondary,
  },
  promoDiscountText: {
    fontWeight: '800',
    color: ParkColors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: ParkColors.border,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalTitle: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  taxInclusive: {
    color: ParkColors.textMuted,
  },
  totalAmount: {
    fontWeight: '900',
    color: ParkColors.primary,
  },
  stickyFooterOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
    ...ParkShadows.sheet,
  },
  stickyFooterInner: {
    width: '100%',
    alignSelf: 'center',
    gap: 8,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
    ...ParkShadows.md,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  cancellationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cancellationText: {
    color: ParkColors.textMuted,
    fontWeight: '500',
  },
});
