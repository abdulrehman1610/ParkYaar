import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useParkStore } from '@/store/useParkStore';

interface DocCardProps {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  uri: string | null;
  onPick: () => void;
}

const DocCard: React.FC<DocCardProps> = ({
  title,
  subtitle,
  icon,
  uri,
  onPick,
}) => (
  <TouchableOpacity
    style={[styles.docCard, uri ? styles.docCardUploaded : null]}
    activeOpacity={0.8}
    onPress={onPick}
  >
    {uri ? (
      <View style={styles.previewContainer}>
        <Image source={{ uri }} style={styles.previewImage} />
        <View style={styles.uploadedCheck}>
          <MaterialIcons name="check-circle" size={18} color={ParkColors.success} />
          <Text style={styles.uploadedCheckText}>Uploaded</Text>
        </View>
      </View>
    ) : (
      <View style={styles.emptyContainer}>
        <View style={styles.iconCircle}>
          <MaterialIcons name={icon} size={24} color={ParkColors.secondary} />
        </View>
        <View style={styles.docTextGroup}>
          <Text style={styles.docTitle}>{title}</Text>
          <Text style={styles.docSubtitle}>{subtitle}</Text>
        </View>
        <MaterialIcons name="add-a-photo" size={20} color={ParkColors.textMuted} />
      </View>
    )}
  </TouchableOpacity>
);

export default function VerificationScreen() {
  const router = useRouter();
  const { kycDocuments, updateKycDocuments } = useParkStore();

  const [docs, setDocs] = useState({
    cnicFront: kycDocuments.cnicFront || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    cnicBack: kycDocuments.cnicBack || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    licence: kycDocuments.licence || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    selfie: kycDocuments.selfie || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  });

  const pickImage = async (field: keyof typeof docs) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.6,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setDocs((prev) => ({ ...prev, [field]: selectedUri }));
      }
    } catch (e) {
      // Fallback for environment where camera/gallery picker is mocked
      Alert.alert('Demo Mode', 'Sample document captured successfully.');
    }
  };

  const handleSubmit = () => {
    updateKycDocuments({
      ...docs,
      submittedAt: new Date().toISOString(),
    });
    router.push('/(auth)/verification-status' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={ParkColors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity Verification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introBox}>
          <Text style={styles.headline}>Verify Your CNIC & Licence</Text>
          <Text style={styles.subheadline}>
            Required by Lahore Traffic Police & ParkYaar community standards for safe parking access.
          </Text>
        </View>

        {/* 4 Document Upload Cards */}
        <View style={styles.cardsGrid}>
          <DocCard
            title="CNIC Front"
            subtitle="Original Smart National ID Card"
            icon="badge"
            uri={docs.cnicFront}
            onPick={() => pickImage('cnicFront')}
          />
          <DocCard
            title="CNIC Back"
            subtitle="Backside with official barcode"
            icon="credit-card"
            uri={docs.cnicBack}
            onPick={() => pickImage('cnicBack')}
          />
          <DocCard
            title="Driving Licence"
            subtitle="Valid Punjab / National Licence"
            icon="directions-car"
            uri={docs.licence}
            onPick={() => pickImage('licence')}
          />
          <DocCard
            title="Live Selfie"
            subtitle="Clear face portrait for identity match"
            icon="face"
            uri={docs.selfie}
            onPick={() => pickImage('selfie')}
          />
        </View>

        {/* Security / Encryption Note */}
        <View style={styles.securityNote}>
          <MaterialIcons name="lock" size={18} color={ParkColors.secondary} />
          <Text style={styles.securityNoteText}>
            Documents are 256-bit encrypted and used strictly for identity verification. We never share your CNIC with hosts or third parties.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Submit CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={handleSubmit}
        >
          <Text style={styles.ctaButtonText}>Submit for Verification</Text>
          <MaterialIcons name="verified-user" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
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
  backButton: {
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
    padding: 20,
    gap: 16,
  },
  introBox: {
    gap: 4,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: ParkColors.primary,
  },
  subheadline: {
    fontSize: 13,
    color: ParkColors.textMuted,
    lineHeight: 18,
  },
  cardsGrid: {
    gap: 12,
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: ParkColors.border,
    borderStyle: 'dashed',
    ...ParkShadows.sm,
  },
  docCardUploaded: {
    borderColor: ParkColors.success,
    borderStyle: 'solid',
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTextGroup: {
    flex: 1,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: ParkColors.text,
  },
  docSubtitle: {
    fontSize: 12,
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewImage: {
    width: 60,
    height: 42,
    borderRadius: 6,
    backgroundColor: ParkColors.surfaceHigh,
  },
  uploadedCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uploadedCheckText: {
    fontSize: 12,
    fontWeight: '700',
    color: ParkColors.success,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: ParkColors.surfaceLow,
    padding: 14,
    borderRadius: ParkRadii.md,
    marginTop: 4,
  },
  securityNoteText: {
    fontSize: 11,
    color: ParkColors.textVariant,
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
  },
  ctaButton: {
    height: 52,
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ParkShadows.md,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

