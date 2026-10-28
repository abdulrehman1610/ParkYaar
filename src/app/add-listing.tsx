import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useParkStore } from '@/store/useParkStore';
import { VehicleType } from '@/types';

export default function AddListingScreen() {
  const router = useRouter();
  const { addListing, user } = useParkStore();
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

  const [title, setTitle] = useState('Covered Car Porch near Main Market');
  const [area, setArea] = useState('Gulberg II');
  const [address, setAddress] = useState(
    'House 19, Block G, Gulberg II, Lahore'
  );
  const [photoUri, setPhotoUri] = useState(
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80'
  );
  const [pricePerHour, setPricePerHour] = useState('140');
  const [pricePerDay, setPricePerDay] = useState('850');
  const [pricePerMonth, setPricePerMonth] = useState('14000');
  const [isCovered, setIsCovered] = useState(true);
  const [cctv, setCctv] = useState(true);
  const [instantBook, setInstantBook] = useState(true);
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleType[]>([
    'car',
    'suv',
  ]);

  const pickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setPhotoUri(res.assets[0].uri);
      }
    } catch {
      Alert.alert('Demo Mode', 'Selected sample driveway photo.');
    }
  };

  const toggleVehicle = (type: VehicleType) => {
    if (selectedVehicles.includes(type)) {
      if (selectedVehicles.length > 1) {
        setSelectedVehicles(selectedVehicles.filter((v) => v !== type));
      }
    } else {
      setSelectedVehicles([...selectedVehicles, type]);
    }
  };

  const handlePublish = () => {
    if (!title.trim() || !address.trim()) {
      Alert.alert(
        'Required Fields',
        'Please enter a title and street address.'
      );
      return;
    }

    addListing({
      type: 'private',
      title,
      area,
      address,
      distance: 'Just listed',
      walkTime: 'New spot in ' + area,
      lat: 31.5204 + (Math.random() - 0.5) * 0.02,
      lng: 74.3587 + (Math.random() - 0.5) * 0.02,
      photos: [photoUri],
      pricePerHour: Number(pricePerHour) || 140,
      pricePerDay: Number(pricePerDay) || 850,
      pricePerMonth: Number(pricePerMonth) || 14000,
      features: [
        'Sedan & SUV friendly',
        isCovered ? 'Covered Carport' : 'Open Paved Bay',
        cctv ? '24/7 CCTV Camera' : 'Secured Boundary',
        'Gated Access',
      ],
      hostName: user.name,
      hostPhoto: user.avatar,
      hostVerified: true,
      hostResponseTime: '< 5 mins',
      hostSince: 'Just joined',
      rating: 5.0,
      reviewCount: 1,
      instantBook,
      vehicleTypes: selectedVehicles,
      isCovered,
      cctv,
      accessProtocol:
        'Call host or buzzer entry on arrival. Sensor camera active.',
      isActive: true,
    });

    Alert.alert(
      'Listing Published! 🎉',
      'Your parking space is now active and discoverable on the Explore map.',
      [
        {
          text: 'View on Explore',
          onPress: () => router.replace('/(tabs)' as any),
        },
      ]
    );
  };

  const iconBtnSize = ms(38);

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
              <MaterialIcons
                name="close"
                size={ms(22)}
                color={ParkColors.text}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontSize: ms(16.5) }]}>
              List Your Parking Space
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
          {/* Photo Picker Hero */}
          <View style={styles.photoPickerSection}>
            <Text style={[styles.sectionLabel, { fontSize: ms(13) }]}>
              Driveway Photo
            </Text>
            <TouchableOpacity
              style={[styles.photoPickerBox, { height: vs(165) }]}
              activeOpacity={0.85}
              onPress={pickImage}
            >
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <View style={styles.changePhotoBadge}>
                <MaterialIcons
                  name="photo-camera"
                  size={ms(14)}
                  color="#FFFFFF"
                />
                <Text style={[styles.changePhotoText, { fontSize: ms(11.5) }]}>
                  Change Photo
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Title & Location Form */}
          <View style={[styles.formCard, { padding: cardPad, gap: vs(12) }]}>
            <Text style={[styles.cardHeader, { fontSize: ms(15.5) }]}>
              Location & Details
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { fontSize: ms(12) }]}>
                Listing Title
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { height: ms(44), fontSize: ms(13.5) },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Covered Porch near MM Alam"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { fontSize: ms(12) }]}>
                Lahore Area
              </Text>
              <View style={[styles.areaChipsRow, { gap: s(8) }]}>
                {[
                  'Gulberg III',
                  'Gulberg II',
                  'DHA Phase 5',
                  'Model Town',
                  'MM Alam',
                ].map((ar) => (
                  <TouchableOpacity
                    key={ar}
                    style={[
                      styles.areaChip,
                      {
                        paddingHorizontal: s(11),
                        paddingVertical: vs(6),
                      },
                      area === ar && styles.areaChipSelected,
                    ]}
                    onPress={() => setArea(ar)}
                  >
                    <Text
                      style={[
                        styles.areaChipText,
                        { fontSize: ms(11.5) },
                        area === ar && styles.areaChipTextSelected,
                      ]}
                    >
                      {ar}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.fieldLabel, { fontSize: ms(12) }]}>
                Complete Street Address
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { height: ms(44), fontSize: ms(13.5) },
                ]}
                value={address}
                onChangeText={setAddress}
                placeholder="House #, Street #, Sector..."
              />
            </View>
          </View>

          {/* Vehicle Compatibility & Type */}
          <View style={[styles.formCard, { padding: cardPad, gap: vs(12) }]}>
            <Text style={[styles.cardHeader, { fontSize: ms(15.5) }]}>
              Vehicle Types Allowed
            </Text>
            <View style={[styles.vehicleTypesRow, { gap: s(8) }]}>
              {(['car', 'suv', 'bike'] as VehicleType[]).map((vType) => {
                const isSelected = selectedVehicles.includes(vType);
                return (
                  <TouchableOpacity
                    key={vType}
                    style={[
                      styles.vTypeBtn,
                      { paddingVertical: vs(10), gap: s(6) },
                      isSelected && styles.vTypeBtnSelected,
                    ]}
                    onPress={() => toggleVehicle(vType)}
                  >
                    <MaterialIcons
                      name={
                        vType === 'bike' ? 'two-wheeler' : 'directions-car'
                      }
                      size={ms(19)}
                      color={
                        isSelected
                          ? ParkColors.secondary
                          : ParkColors.textMuted
                      }
                    />
                    <Text
                      style={[
                        styles.vTypeText,
                        { fontSize: ms(12) },
                        isSelected && styles.vTypeTextSelected,
                      ]}
                    >
                      {vType.toUpperCase()}
                    </Text>
                    {isSelected && (
                      <MaterialIcons
                        name="check"
                        size={ms(13)}
                        color={ParkColors.secondary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Pricing Model */}
          <View style={[styles.formCard, { padding: cardPad, gap: vs(12) }]}>
            <Text style={[styles.cardHeader, { fontSize: ms(15.5) }]}>
              Set Your Rental Rates (PKR)
            </Text>
            <View
              style={[
                styles.priceInputsGrid,
                {
                  gap: s(10),
                  flexDirection: isSmallPhone ? 'column' : 'row',
                },
              ]}
            >
              <View style={[styles.priceInputBox, { padding: s(10) }]}>
                <Text style={[styles.priceInputLabel, { fontSize: ms(11) }]}>
                  Hourly Rate
                </Text>
                <View style={styles.priceInputRow}>
                  <Text style={[styles.rsPrefix, { fontSize: ms(12) }]}>
                    Rs
                  </Text>
                  <TextInput
                    style={[styles.priceInput, { fontSize: ms(15) }]}
                    keyboardType="number-pad"
                    value={pricePerHour}
                    onChangeText={setPricePerHour}
                  />
                  <Text style={[styles.rsSuffix, { fontSize: ms(11) }]}>
                    /hr
                  </Text>
                </View>
              </View>

              <View style={[styles.priceInputBox, { padding: s(10) }]}>
                <Text style={[styles.priceInputLabel, { fontSize: ms(11) }]}>
                  Full Day
                </Text>
                <View style={styles.priceInputRow}>
                  <Text style={[styles.rsPrefix, { fontSize: ms(12) }]}>
                    Rs
                  </Text>
                  <TextInput
                    style={[styles.priceInput, { fontSize: ms(15) }]}
                    keyboardType="number-pad"
                    value={pricePerDay}
                    onChangeText={setPricePerDay}
                  />
                  <Text style={[styles.rsSuffix, { fontSize: ms(11) }]}>
                    /day
                  </Text>
                </View>
              </View>

              <View style={[styles.priceInputBox, { padding: s(10) }]}>
                <Text style={[styles.priceInputLabel, { fontSize: ms(11) }]}>
                  Monthly Pass
                </Text>
                <View style={styles.priceInputRow}>
                  <Text style={[styles.rsPrefix, { fontSize: ms(12) }]}>
                    Rs
                  </Text>
                  <TextInput
                    style={[styles.priceInput, { fontSize: ms(15) }]}
                    keyboardType="number-pad"
                    value={pricePerMonth}
                    onChangeText={setPricePerMonth}
                  />
                  <Text style={[styles.rsSuffix, { fontSize: ms(11) }]}>
                    /mo
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Amenities & Instant Book Toggles */}
          <View style={[styles.formCard, { padding: cardPad, gap: vs(12) }]}>
            <Text style={[styles.cardHeader, { fontSize: ms(15.5) }]}>
              Amenities & Features
            </Text>

            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={[styles.switchTitle, { fontSize: ms(13.5) }]}>
                  Covered Roof
                </Text>
                <Text style={[styles.switchSub, { fontSize: ms(11.5) }]}>
                  Protects vehicle from sun & rain
                </Text>
              </View>
              <Switch
                value={isCovered}
                onValueChange={setIsCovered}
                trackColor={{
                  false: ParkColors.border,
                  true: ParkColors.secondary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={[styles.switchTitle, { fontSize: ms(13.5) }]}>
                  24/7 CCTV Camera
                </Text>
                <Text style={[styles.switchSub, { fontSize: ms(11.5) }]}>
                  Bay is under constant surveillance
                </Text>
              </View>
              <Switch
                value={cctv}
                onValueChange={setCctv}
                trackColor={{
                  false: ParkColors.border,
                  true: ParkColors.secondary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={[styles.switchTitle, { fontSize: ms(13.5) }]}>
                  Instant Booking
                </Text>
                <Text style={[styles.switchSub, { fontSize: ms(11.5) }]}>
                  Guests can book without waiting for approval
                </Text>
              </View>
              <Switch
                value={instantBook}
                onValueChange={setInstantBook}
                trackColor={{
                  false: ParkColors.border,
                  true: ParkColors.secondary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Publish CTA */}
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
              style={[styles.publishBtn, { height: ms(50) }]}
              activeOpacity={0.88}
              onPress={handlePublish}
            >
              <Text style={[styles.publishBtnText, { fontSize: ms(15) }]}>
                Publish Listing Now
              </Text>
              <MaterialIcons
                name="arrow-forward"
                size={ms(19)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
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
  headerOuter: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
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
  photoPickerSection: {
    gap: 8,
  },
  sectionLabel: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  photoPickerBox: {
    borderRadius: ParkRadii.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: ParkColors.surfaceHigh,
    ...ParkShadows.sm,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  changePhotoBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(11, 37, 69, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  changePhotoText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    borderWidth: 1,
    borderColor: ParkColors.border,
    ...ParkShadows.sm,
  },
  cardHeader: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontWeight: '600',
    color: ParkColors.textMuted,
  },
  textInput: {
    backgroundColor: ParkColors.backgroundLight,
    borderRadius: ParkRadii.md,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: ParkColors.border,
    fontWeight: '600',
    color: ParkColors.text,
  },
  areaChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  areaChip: {
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  areaChipSelected: {
    backgroundColor: ParkColors.secondary,
    borderColor: ParkColors.secondary,
  },
  areaChipText: {
    fontWeight: '600',
    color: ParkColors.text,
  },
  areaChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  vehicleTypesRow: {
    flexDirection: 'row',
  },
  vTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    borderWidth: 1.5,
    borderColor: ParkColors.border,
  },
  vTypeBtnSelected: {
    borderColor: ParkColors.secondary,
    backgroundColor: '#FFFFFF',
  },
  vTypeText: {
    fontWeight: '700',
    color: ParkColors.textMuted,
  },
  vTypeTextSelected: {
    color: ParkColors.primary,
  },
  priceInputsGrid: {
    width: '100%',
  },
  priceInputBox: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 4,
  },
  priceInputLabel: {
    color: ParkColors.textMuted,
    fontWeight: '600',
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rsPrefix: {
    fontWeight: '700',
    color: ParkColors.textMuted,
  },
  priceInput: {
    flex: 1,
    fontWeight: '800',
    color: ParkColors.primary,
    padding: 0,
    margin: 0,
  },
  rsSuffix: {
    color: ParkColors.textMuted,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 10,
  },
  switchText: {
    flex: 1,
    gap: 2,
  },
  switchTitle: {
    fontWeight: '700',
    color: ParkColors.primary,
  },
  switchSub: {
    color: ParkColors.textMuted,
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
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ParkColors.secondary,
    borderRadius: 9999,
    ...ParkShadows.md,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
