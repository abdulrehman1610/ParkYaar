import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Base reference dimensions (Standard modern mobile viewport: 390 x 844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Device category breakpoints
  const isSmallPhone = width < 360;
  const isCompact = width < 380 || height < 700;
  const isPhone = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;
  const isWide = width >= 680;
  const isLandscape = width > height;

  // Effective scaling width (clamped on tablet/desktop so elements scale gracefully without becoming oversized)
  const effectiveWidth = Math.min(Math.max(width, 320), 500);
  const effectiveHeight = Math.min(Math.max(height, 568), 960);

  const widthRatio = effectiveWidth / BASE_WIDTH;
  const heightRatio = effectiveHeight / BASE_HEIGHT;

  /**
   * Horizontal / general linear scale clamped smoothly for small phones through large displays
   */
  const s = (size: number) => Math.round(size * widthRatio);

  /**
   * Vertical scale based on display height
   */
  const vs = (size: number) => Math.round(size * heightRatio);

  /**
   * Moderate scale for typography, icons, radii, and interactive controls
   */
  const ms = (size: number, factor = 0.45) =>
    Math.round(size + (size * widthRatio - size) * factor);

  // Adaptive spacing & container tokens
  const hPad = isSmallPhone ? 12 : isDesktop ? 32 : isTablet ? 24 : s(16);
  const vGap = isCompact ? 10 : isDesktop || isTablet ? 18 : vs(14);
  const cardPad = isSmallPhone ? 10 : isDesktop || isTablet ? 18 : s(14);
  const chipGap = isSmallPhone ? 6 : s(8);

  // Header & Navigation Bar dimensions
  const headerHeight = isCompact ? 48 : isDesktop || isTablet ? 60 : vs(54);
  const headerTopPad = Math.max(insets.top, isCompact ? 8 : 12);

  // iOS Floating Tab Bar dimensions
  const navBarHeight = isCompact ? 58 : isDesktop || isTablet ? 68 : vs(64);
  const navBarBottom = Math.max(insets.bottom, isCompact ? 12 : 14) + (isCompact ? 4 : 6);
  const navBarMaxWidth = isDesktop
    ? 540
    : isTablet
    ? 460
    : Math.min(width - hPad * 2, 420);

  // Scroll & Sticky Footer clearances (guarantees zero overlap with navbar or system buttons)
  const tabScrollBottomPad = navBarHeight + navBarBottom + vs(28);
  const stickyFooterBottomPad = Math.max(insets.bottom, isCompact ? 12 : 16) + (isCompact ? 6 : 10);

  // Max widths for wide screens (tablets, foldables, web browsers)
  const contentMaxWidth = isDesktop ? 1120 : isTablet ? 860 : width;
  const formMaxWidth = isDesktop ? 640 : isTablet ? 580 : width;

  // Responsive grid columns
  const numColumns = isDesktop ? 3 : isWide ? 2 : 1;

  // Adaptive Map height
  const mapHeight = isCompact
    ? Math.round(Math.max(height * 0.34, 220))
    : isDesktop || isTablet
    ? Math.round(Math.min(height * 0.44, 420))
    : Math.round(Math.min(Math.max(height * 0.4, 260), 370));

  return {
    width,
    height,
    insets,
    isSmallPhone,
    isCompact,
    isPhone,
    isTablet,
    isDesktop,
    isWide,
    isLandscape,
    s,
    vs,
    ms,
    hPad,
    vGap,
    cardPad,
    chipGap,
    headerHeight,
    headerTopPad,
    navBarHeight,
    navBarBottom,
    navBarMaxWidth,
    tabScrollBottomPad,
    stickyFooterBottomPad,
    contentMaxWidth,
    formMaxWidth,
    numColumns,
    mapHeight,
  };
}

