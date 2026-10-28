import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ParkColors } from '@/constants/theme';

interface WebContainerProps {
  children: React.ReactNode;
}

export const WebContainer: React.FC<WebContainerProps> = ({ children }) => {
  return <View style={styles.responsiveRoot}>{children}</View>;
};

const styles = StyleSheet.create({
  responsiveRoot: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    backgroundColor: ParkColors.background,
    overflow: 'hidden',
  },
});
