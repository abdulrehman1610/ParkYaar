---
name: ParkYaar Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#495f82'
  primary: '#001026'
  on-primary: '#ffffff'
  primary-container: '#0b2545'
  on-primary-container: '#778db2'
  inverse-primary: '#b1c7f0'
  secondary: '#0056c3'
  on-secondary: '#ffffff'
  secondary-container: '#1f6feb'
  on-secondary-container: '#fefcff'
  tertiary: '#190d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#362000'
  on-tertiary-container: '#c07e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#b1c7f0'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#314769'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#afc6ff'
  on-secondary-fixed: '#001944'
  on-secondary-fixed-variant: '#004299'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#ffb955'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  price-display:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-trust, utilitarian peer-to-peer mobility marketplace tailored to urban Pakistani transit landscapes, beginning with Lahore. The product solves high-friction street chaos by turning private driveways, commercial basements, and vacant plots into dependable parking.

The aesthetic blends **Modern Utilitarian Transit** with **Civic Reliability**:
- **Trust-first & Secure:** Peer-to-peer asset sharing demands radical transparency, verified credentialing, and zero ambiguity on physical safety.
- **High-contrast Glanceability:** Interfaces must perform under direct South Asian daylight on mobile screens with varying quality and glare. Critical actions and pricing must be legible in split-second driving or navigating contexts.
- **Tactile Softness:** Clean surfaces, generous 16px radius cards, fluid floating sheets, and full-width pill controls invite confident single-thumb execution.

## Colors

The palette establishes immediate municipal authority while retaining interactive vibrancy:
- **Primary Navy (`#0B2545`):** Serves as the primary anchor for headers, structural brand touches, and high-emphasis textual markers. Communicates stability and civic confidence.
- **Parking Blue (`#1F6FEB`):** The primary interaction driver. Used for CTAs, active tab indicators, hyperlinked affordances, verified badges, and private peer-to-peer parking map markers.
- **Amber Accent (`#F5A623`):** High-visibility functional accent. Denotes commercial/public parking zones, promotional discounts, warning notices, and rating badges.
- **Background & Surfaces:** App canvas sits on a clean slate tint (`#F4F6F8`), isolating pure white (`#FFFFFF`) card surfaces and interactive bottom sheets without heavy border lines.
- **Feedback & Semantics:** Strict validation tokens using `#16A34A` for successful reservations, spot verification, and earnings, paired with `#DC2626` for cancellations, expired meters, or errors. Borders maintain crisp division using `#E2E8F0`.

## Typography

The typographic hierarchy combines geometric structure for orientation with neutral clarity for data reading:
- **Display, Headings & Primary Buttons:** Rendered in `Outfit` (chosen for its crisp, geometric modern forms, delivering the balanced, punchy presence of Poppins). SemiBold (600) and Bold (700) weights give listings and action triggers strong authority.
- **Body, Captions & Technical Labels:** Rendered in `Inter` (400 Regular and 500 Medium) to provide rock-solid legibility for street addresses, pricing disclosures, vehicle specs, and onboarding steps.
- **Pakistani Rupee Prefix Standard:** Currency must always be formatted as `Rs ` or `PKR ` followed by the figure (e.g., `Rs 150/hr`), rendered with tabular numerical tracking to maintain horizontal alignment across lists and map callouts.

## Layout & Spacing

Designed strictly around the target mobile baseline (iPhone portrait 390×844 pt):
- **Grid & Margins:** Fluid single-column mobile view with standard 16px (`1rem`) outer canvas margins. Components snap to a strict 4pt/8pt linear rhythm.
- **Safe Zone Accommodations:** Dynamic viewport offset accommodating the top Dynamic Island / status bar (47px) and home indicator safe area (34px at base).
- **Map & Floating Layer Architecture:** Map elements occupy full-bleed canvas space behind modular z-indexed layers:
  - Floating top search and filter rail: anchored 12px below the top safe area.
  - Floating bottom sheet peek cards: docked 16px above the active navigation bar.
- **Thumb Reachability:** All critical actionable surfaces (bottom sheet handles, booking CTAs, location snaps) are positioned within the bottom 45% of the screen height.

## Elevation & Depth

Visual hierarchy uses a refined ambient shadow structure rather than stark lines, keeping the UI airy and contemporary:

- **Level 0 (Flat):** Canvas background (`#F4F6F8`) and neutral input states.
- **Level 1 (Surface Cards):** White containers floating against the tinted canvas rely on an ambient navy-tinted shadow: `box-shadow: 0px 4px 16px rgba(11, 37, 69, 0.06); border: 1px solid #E2E8F0;`.
- **Level 2 (Floating Action Sheets & Filter Bars):** Raised search containers and horizontal scroll pills: `box-shadow: 0px 8px 24px rgba(11, 37, 69, 0.10);`.
- **Level 3 (Modals, Overlays & Sticky Bottom CTA Bars):** Anchored bottom navigation and booking trays: `box-shadow: 0px -4px 20px rgba(11, 37, 69, 0.08);`.

## Shapes

The interface embraces a rounded-modern aesthetic that feels accessible and friendly:
- **Card Surfaces:** Standardized at `rounded-lg` (16px / 1rem radius) to frame listing images, host credentials, and reservation summaries smoothly.
- **Interactive Controls & Badges:** Primary buttons, input containers, filter chips, and verified markers use full pill shaping (`rounded-full` / 9999px) or structured `rounded-md` (8px / 0.5rem) depending on density.
- **Bottom Sheets:** Top corners feature an oversized radius of 24px with a centered 4×36px pill drag indicator.

## Components

### Buttons
- **Primary Action (52px Full-Width Pill):** Solid `#1F6FEB` background, white text (`label-lg`), pill-shaped (`border-radius: 9999px`). States: Active scale 0.98, hover/pressed `#1557B8`.
- **Secondary / Outline:** White or transparent fill, 1.5px solid border `#0B2545`, text color `#0B2545`.
- **Ghost Action:** Transparent background with `#1F6FEB` text for inline triggers ("Change Spot", "View Route").

### Floating Search & Pill Filters
- **Floating Search Bar:** 48px height, 16px horizontal margin, `#FFFFFF` background with Level 2 elevation. Left magnifying glass icon, placeholder in `#64748B`, right quick-filter action icon.
- **Horizontal Chip Rail:** Height 36px, full pill shape (`border-radius: 9999px`). Inactive: `#FFFFFF` surface, `#E2E8F0` border, `#1A1A1A` text. Active: `#0B2545` surface, `#FFFFFF` text. Supports vehicle filters (`Car`, `Bike`, `SUV`), amenity badges (`Covered`), and budget thresholds (`Under Rs 200`).

### Surface Cards & Map Pins
- **Parking Spot Card:** `#FFFFFF` background, 16px radius, Level 1 shadow. Displays 120px aspect ratio preview image, price block (`Rs 150/hr`), spot type, distance meter, and host rating.
- **Map Markers:** 
  - Private P2P spots: Solid `#1F6FEB` pill pin showing live price ("Rs 100").
  - Public/Commercial lots: Solid `#F5A623` circular pin.
  - Selected state: Expands with a white halo and anchors a floating peek card.

### Verified Trust Badges
- **Shield-Check Badge:** Pill badge with `#1F6FEB` background or 10% tinted tint with solid `#1F6FEB` text and shield-check icon. Denotes CNIC-verified hosts, gated CCTV compounds, and physically inspected bays.

### Input Fields & Controls
- **Form Inputs:** 48px height, 12px radius, `#FFFFFF` surface with 1px `#E2E8F0` border. Active focus state transitions to 1.5px `#1F6FEB` border with zero outline ring.
- **Radio & Spot Selector:** 20px circular indicator; selected state filled with `#1F6FEB` displaying a crisp 6px white center dot.

### Bottom Navigation Bar
- **Dimensions:** 64px height + 34px bottom safe area margin. Surface: `#FFFFFF` with Level 3 elevation border.
- **Destinations:** 4 evenly spaced tabs (`Explore`, `Bookings`, `Host`, `Profile`). Active tab displays 24px icon and label in `#1F6FEB`; inactive tabs display `#64748B`.