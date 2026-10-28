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

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
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
}) => {
  const { s, ms, cardPad } = useResponsive();
  return (
    <TouchableOpacity
      style={[
        styles.docCard,
        { padding: cardPad },
        uri ? styles.docCardUploaded : null,
      ]}
      activeOpacity={0.8}
      onPress={onPick}
    >
      <View style={[styles.emptyContainer, { gap: s(12) }]}>
        {uri ? (
          <Image
            source={{ uri }}
            style={[
              styles.previewImage,
              { width: ms(56), height: ms(42) },
            ]}
          />
        ) : (
          <View
            style={[
              styles.iconCircle,
              {
                width: ms(44),
                height: ms(44),
                borderRadius: ms(22),
              },
            ]}
          >
            <MaterialIcons
              name={icon}
              size={ms(22)}
              color={ParkColors.secondary}
            />
          </View>
        )}
        <View style={styles.docTextGroup}>
          <Text style={[styles.docTitle, { fontSize: ms(14.5) }]}>{title}</Text>
          <Text style={[styles.docSubtitle, { fontSize: ms(11.5) }]}>
            {subtitle}
          </Text>
        </View>
        {uri ? (
          <View style={styles.uploadedCheck}>
            <MaterialIcons
              name="check-circle"
              size={ms(18)}
              color={ParkColors.success}
            />
            <Text style={[styles.uploadedCheckText, { fontSize: ms(11.5) }]}>
              Uploaded
            </Text>
          </View>
        ) : (
          <MaterialIcons
            name="add-a-photo"
            size={ms(20)}
            color={ParkColors.textMuted}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function VerificationScreen() {
  const router = useRouter();
  const { kycDocuments, updateKycDocuments } = useParkStore();
  const {
    s,
    vs,
    ms,
    hPad,
    vGap,
    headerHeight,
    headerTopPad,
    stickyFooterBottomPad,
    formMaxWidth,
  } = useResponsive();

  const [docs, setDocs] = useState({
    cnicFront:
      kycDocuments.cnicFront ||
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    cnicBack:
      kycDocuments.cnicBack ||
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    licence:
      kycDocuments.licence ||
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    selfie:
      kycDocuments.selfie ||
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
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
    } catch {
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

  const iconBtnSize = ms(38);

  return (
    <View style={styles.safeArea}>
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
              styles.backButton,
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
            Identity Verification
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
            paddingBottom: vs(24),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introBox}>
          <Text style={[styles.headline, { fontSize: ms(22) }]}>
            Verify Your CNIC & Licence
          </Text>
          <Text style={[styles.subheadline, { fontSize: ms(13) }]}>
            Required by Lahore Traffic Police & ParkYaar community standards for
            safe parking access.
          </Text>
        </View>

        {/* 4 Document Upload Cards */}
        <View style={[styles.cardsGrid, { gap: vs(12) }]}>
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
        <View style={[styles.securityNote, { padding: s(14), gap: s(10) }]}>
          <MaterialIcons
            name="lock"
            size={ms(18)}
            color={ParkColors.secondary}
          />
          <Text style={[styles.securityNoteText, { fontSize: ms(11.5) }]}>
            Documents are 256-bit encrypted and used strictly for identity
            verification. We never share your CNIC with hosts or third parties.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Submit CTA */}
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
            style={[styles.ctaButton, { height: ms(50) }]}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            <Text style={[styles.ctaButtonText, { fontSize: ms(15.5) }]}>
              Submit for Verification
            </Text>
            <MaterialIcons
              name="verified-user"
              size={ms(19)}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ParkColors.backgroundLight,
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
  backButton: {
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
  introBox: {
    gap: 4,
  },
  headline: {
    fontWeight: '800',
    color: ParkColors.primary,
  },
  subheadline: {
    color: ParkColors.textMuted,
    lineHeight: 19,
  },
  cardsGrid: {
    width: '100%',
  },
  docCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: ParkRadii.lg,
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
  },
  iconCircle: {
    backgroundColor: ParkColors.surfaceLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docTextGroup: {
    flex: 1,
  },
  docTitle: {
    fontWeight: '700',
    color: ParkColors.text,
  },
  docSubtitle: {
    color: ParkColors.textMuted,
    marginTop: 2,
  },
  previewImage: {
    borderRadius: 6,
    backgroundColor: ParkColors.surfaceHigh,
  },
  uploadedCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  uploadedCheckText: {
    fontWeight: '700',
    color: ParkColors.success,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: ParkRadii.md,
  },
  securityNoteText: {
    color: ParkColors.textVariant,
    flex: 1,
    lineHeight: 16,
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
  ctaButton: {
    borderRadius: 9999,
    backgroundColor: ParkColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ParkShadows.md,
  },
  ctaButtonText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
