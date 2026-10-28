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
import { SafeAreaView } from 'react-native-safe-area-context';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';
import { VehicleType } from '@/types';

export default function AddListingScreen() {
  const router = useRouter();
  const { addListing, user } = useParkStore();

  const [title, setTitle] = useState('Covered Car Porch near Main Market');
  const [area, setArea] = useState('Gulberg II');
  const [address, setAddress] = useState('House 19, Block G, Gulberg II, Lahore');
  const [photoUri, setPhotoUri] = useState('https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80');
  const [spotType, setSpotType] = useState<'Covered Porch' | 'Open Driveway' | 'Gated Plot'>('Covered Porch');
  const [pricePerHour, setPricePerHour] = useState('140');
  const [pricePerDay, setPricePerDay] = useState('850');
  const [pricePerMonth, setPricePerMonth] = useState('14000');
  const [isCovered, setIsCovered] = useState(true);
  const [cctv, setCctv] = useState(true);
  const [instantBook, setInstantBook] = useState(true);
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleType[]>(['car', 'suv']);

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
      Alert.alert('Required Fields', 'Please enter a title and street address.');
      return;
    }

    const newId = addListing({
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
      accessProtocol: 'Call host or buzzer entry on arrival. Sensor camera active.',
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
            <MaterialIcons name="close" size={24} color={ParkColors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List Your Parking Space</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Photo Picker Hero */}
          <View style={styles.photoPickerSection}>
            <Text style={styles.sectionLabel}>Driveway Photo</Text>
            <TouchableOpacity
              style={styles.photoPickerBox}
              activeOpacity={0.85}
              onPress={pickImage}
            >
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <View style={styles.changePhotoBadge}>
                <MaterialIcons name="photo-camera" size={14} color="#FFFFFF" />
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Title & Location Form */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeader}>Location & Details</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Listing Title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Covered Porch near MM Alam"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Lahore Area</Text>
              <View style={styles.areaChipsRow}>
                {['Gulberg III', 'Gulberg II', 'DHA Phase 5', 'Model Town', 'MM Alam'].map((ar) => (
                  <TouchableOpacity
                    key={ar}
                    style={[
                      styles.areaChip,
                      area === ar && styles.areaChipSelected,
                    ]}
                    onPress={() => setArea(ar)}
                  >
                    <Text
                      style={[
                        styles.areaChipText,
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
              <Text style={styles.fieldLabel}>Complete Street Address</Text>
              <TextInput
                style={styles.textInput}
                value={address}
                onChangeText={setAddress}
                placeholder="House #, Street #, Sector..."
              />
            </View>
          </View>

          {/* Vehicle Compatibility & Type */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeader}>Vehicle Types Allowed</Text>
            <View style={styles.vehicleTypesRow}>
              {(['car', 'suv', 'bike'] as VehicleType[]).map((vType) => {
                const isSelected = selectedVehicles.includes(vType);
                return (
                  <TouchableOpacity
                    key={vType}
                    style={[
                      styles.vTypeBtn,
                      isSelected && styles.vTypeBtnSelected,
                    ]}
                    onPress={() => toggleVehicle(vType)}
                  >
                    <MaterialIcons
                      name={
                        vType === 'bike'
                          ? 'two-wheeler'
                          : vType === 'suv'
                          ? 'directions-car'
                          : 'directions-car'
                      }
                      size={20}
                      color={isSelected ? ParkColors.secondary : ParkColors.textMuted}
                    />
                    <Text
                      style={[
                        styles.vTypeText,
                        isSelected && styles.vTypeTextSelected,
                      ]}
                    >
                      {vType.toUpperCase()}
                    </Text>
                    {isSelected && (
                      <MaterialIcons name="check" size={14} color={ParkColors.secondary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Pricing Model */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeader}>Set Your Rental Rates (PKR)</Text>
            <View style={styles.priceInputsGrid}>
              <View style={styles.priceInputBox}>
                <Text style={styles.priceInputLabel}>Hourly Rate</Text>
                <View style={styles.priceInputRow}>
                  <Text style={styles.rsPrefix}>Rs</Text>
                  <TextInput
                    style={styles.priceInput}
                    keyboardType="number-pad"
                    value={pricePerHour}
                    onChangeText={setPricePerHour}
                  />
                  <Text style={styles.rsSuffix}>/hr</Text>
                </View>
              </View>

              <View style={styles.priceInputBox}>
                <Text style={styles.priceInputLabel}>Full Day</Text>
                <View style={styles.priceInputRow}>
                  <Text style={styles.rsPrefix}>Rs</Text>
                  <TextInput
                    style={styles.priceInput}
                    keyboardType="number-pad"
                    value={pricePerDay}
                    onChangeText={setPricePerDay}
                  />
                  <Text style={styles.rsSuffix}>/day</Text>
                </View>
              </View>

              <View style={styles.priceInputBox}>
                <Text style={styles.priceInputLabel}>Monthly Pass</Text>
                <View style={styles.priceInputRow}>
                  <Text style={styles.rsPrefix}>Rs</Text>
                  <TextInput
                    style={styles.priceInput}
                    keyboardType="number-pad"
                    value={pricePerMonth}
                    onChangeText={setPricePerMonth}
                  />
                  <Text style={styles.rsSuffix}>/mo</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Amenities & Instant Book Toggles */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeader}>Amenities & Features</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.switchTitle}>Covered Roof</Text>
                <Text style={styles.switchSub}>Protects vehicle from sun & rain</Text>
              </View>
              <Switch
                value={isCovered}
                onValueChange={setIsCovered}
                trackColor={{ false: ParkColors.border, true: ParkColors.secondary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.switchTitle}>24/7 CCTV Camera</Text>
                <Text style={styles.switchSub}>Bay is under constant surveillance</Text>
              </View>
              <Switch
                value={cctv}
                onValueChange={setCctv}
                trackColor={{ false: ParkColors.border, true: ParkColors.secondary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.switchTitle}>Instant Booking</Text>
                <Text style={styles.switchSub}>Guests can book without waiting for approval</Text>
              </View>
              <Switch
                value={instantBook}
                onValueChange={setInstantBook}
                trackColor={{ false: ParkColors.border, true: ParkColors.secondary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Publish CTA */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.publishBtn}
            activeOpacity={0.88}
            onPress={handlePublish}
          >
            <Text style={styles.publishBtnText}>Publish Listing Now</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
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
    paddingBottom: 32,
  },
  photoPickerSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: ParkColors.text,
  },
  photoPickerBox: {
    width: '100%',
    height: 180,
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
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(11, 37, 69, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  changePhotoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: ParkColors.border,
    gap: 14,
    ...ParkShadows.sm,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: ParkColors.primary,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: ParkColors.textMuted,
  },
  textInput: {
    height: 46,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
    paddingHorizontal: 14,
    fontSize: 14,
    color: ParkColors.text,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  areaChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  areaChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: ParkColors.surfaceLow,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  areaChipSelected: {
    backgroundColor: ParkColors.secondary,
    borderColor: ParkColors.secondary,
  },
  areaChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: ParkColors.text,
  },
  areaChipTextSelected: {
    color: '#FFFFFF',
  },
  vehicleTypesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  vTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: ParkColors.surfaceLow,
    paddingVertical: 12,
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  vTypeBtnSelected: {
    borderColor: ParkColors.secondary,
    backgroundColor: ParkColors.surfaceHigh,
  },
  vTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.textMuted,
  },
  vTypeTextSelected: {
    color: ParkColors.secondary,
  },
  priceInputsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  priceInputBox: {
    flex: 1,
    backgroundColor: ParkColors.surfaceLow,
    padding: 10,
    borderRadius: ParkRadii.md,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  priceInputLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: ParkColors.textMuted,
    marginBottom: 4,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rsPrefix: {
    fontSize: 11,
    fontWeight: '700',
    color: ParkColors.textMuted,
    marginRight: 2,
  },
  priceInput: {
    fontSize: 16,
    fontWeight: '800',
    color: ParkColors.primary,
    padding: 0,
    flex: 1,
  },
  rsSuffix: {
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchText: {
    flex: 1,
    paddingRight: 10,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: ParkColors.text,
  },
  switchSub: {
    fontSize: 11,
    color: ParkColors.textMuted,
    marginTop: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
  },
  publishBtn: {
    height: 52,
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ParkShadows.md,
  },
  publishBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

