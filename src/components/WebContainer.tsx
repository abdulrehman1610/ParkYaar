import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ParkColors } from '@/constants/theme';

interface WebContainerProps {
  children: React.ReactNode;
}

export const WebContainer: React.FC<WebContainerProps> = ({ children }) => {
  if (Platform.OS !== 'web') {
    return <View style={styles.nativeContainer}>{children}</View>;
  }

  return (
    <View style={styles.webOuter}>
      <View style={styles.webInner}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: ParkColors.background,
  },
  webOuter: {
    flex: 1,
    backgroundColor: '#071322', // Sleek dark outer background on desktop web
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    width: '100%',
  },
  webInner: {
    width: '100%',
    maxWidth: 430,
    minHeight: '100%',
    backgroundColor: ParkColors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 10,
    overflow: 'hidden',
  },
});
