# PRD: ParkYaar MVP (React Native, Expo)

## 1. Goal
Build a polished, fully clickable MVP of ParkYaar, a peer-to-peer parking marketplace for Pakistan, for a university project expo happening TOMORROW. Evaluators will use the app on a phone and on a laptop. It must look finished, never crash, and demonstrate the complete flow: verify -> find parking -> book -> pay -> navigate, plus the owner side: list space -> manage requests -> see earnings.

This is a DEMO-GRADE MVP: no real backend and no real integrations. KYC review and payments are SIMULATED and labelled "Test mode". It matches our report's MVP scope (registration with manual KYC, listings, search, booking, test-mode payments).

## 2. Design source of truth
Screenshots of the Stitch designs are in /design-reference. Match their layout, spacing, colours and typography as closely as possible. If a screen is missing, design it consistently with the rest.

Design tokens:
- navy #0B2545, blue #1F6FEB, amber #F5A623, background #F4F6F8, card #FFFFFF, text #1A1A1A, success #16A34A, error #DC2626
- Fonts: Poppins (headings) and Inter (body) via @expo-google-fonts
- 16px card radius, soft shadows, 52px pill buttons, Lucide-style icons (lucide-react-native or @expo/vector-icons)
- Use the logo from /assets/logo.png on splash, login and header.

## 3. Tech stack and hard constraints
- Expo (latest stable SDK), TypeScript, Expo Router (file-based navigation)
- Styling: React Native StyleSheet only
- State: Zustand with persistence to AsyncStorage
- Must run with `npx expo start` in Expo Go on a real phone AND with `npx expo start --web` on a laptop, with ZERO API keys or accounts
- Allowed libraries: expo-image-picker, expo-linking, react-native-svg, react-native-qrcode-svg, react-native-maps (native only), expo-haptics, expo-font, @react-native-async-storage/async-storage, react-native-reanimated (only if stable in Expo Go)
- Map: components/ParkMap.tsx uses react-native-maps on native. components/ParkMap.web.tsx renders a stylised static Lahore map (SVG/image background with absolutely positioned tappable pins), because react-native-maps does not work on web. Both expose the same props and are tested.
- Do NOT add a backend, auth provider, native modules outside Expo Go, or heavy dependencies.

## 4. Navigation
- Auth stack: Splash -> Login -> OTP -> Verification -> Verification Status
- Main tabs: Explore, Bookings, Host, Profile
- Stack screens: Listing Detail, Booking, Payment, Booking Confirmed, Public Parking Detail, QR Scan, Add Listing

## 5. Data models (TypeScript)
- User { id, name, phone, verified, rating, mode: 'seeker' | 'owner' }
- Listing { id, type: 'private' | 'public', title, area, lat, lng, photos[], pricePerHour, pricePerDay, pricePerMonth, features[], hostName, hostVerified, rating, reviewCount, instantBook, totalSpots?, freeSpots? }
- Booking { id, listingId, vehicle, date, startTime, hours, total, status: 'pending' | 'confirmed' | 'completed' | 'cancelled', paymentMethod, qrCode }
- Vehicle { id, model, plate }

Seed data (hard-coded, realistic): 10 private listings and 4 public/corporate lots (e.g. Emporium Mall, a hospital lot, a market plaza) spread around Lahore (center 31.5204, 74.3587; approximate coordinates near Anarkali, Liberty Market, Gulberg, Model Town, Mayo Hospital). Use free placeholder photos (bundled or remote URLs with a local fallback). Include a demo user with one saved vehicle (Honda Civic, LEA-1234) and 2 past bookings.

## 6. Features by priority (build in this order, run and fix after each phase)

### P0: core demo flow (app must be demo-ready after this)
1. Splash (1.5s) -> Login (+92 phone) -> OTP (accept any 6 digits, prefill 123456) -> Verification.
2. Verification: 4 upload cards (CNIC front, CNIC back, licence, selfie) using expo-image-picker (camera or gallery) with previews. On submit show "Under review" for ~3 seconds, then auto-approve and show the "Verified" screen with the shield badge. Add a note: "Documents are encrypted and used only for verification."
3. Explore: map with blue price pins for private listings and amber "P" pins for public lots. Segmented toggle Private | Public & Corporate filters the pins. Search bar filters by area/title. Filter chips (Car, Bike, SUV, Covered, Under Rs 200) work. Bottom sheet lists the matching cards. Tapping a pin or card opens the listing.
4. Listing Detail: carousel, host card with Verified badge, features, prices, mini map, "Book now".
5. Booking: vehicle selector, date, start time, hours stepper, live total (hours x hourly price).
6. Payment: JazzCash / Easypaisa / Card radio options with a "Test mode, no real money charged" chip. "Pay" shows a 2-second processing animation, then success.
7. Booking Confirmed: success state, summary card, QR code (react-native-qrcode-svg) encoding the booking id, "Navigate" (opens Google Maps via expo-linking with the listing's lat/lng), "Chat with host" and "Call (masked)" (simple modal/mock).
8. Bookings tab: Upcoming / Past / Cancelled lists with status chips. The new booking appears immediately and persists after app reload.

### P1: owner side
9. Host tab: dashboard with earnings card ("This month" with a small bar chart from seed + new bookings), stats, pending requests with Approve/Decline (approving updates the seeker's booking status), "My listings" with active toggle.
10. Add Listing wizard (photos via picker, location choice, type, vehicle size, prices per hour/day/month, availability, instant-book toggle). Publishing adds the listing to the Explore map immediately.
11. Profile: avatar, Verified badge, rating, "Switch to Host mode" toggle that jumps to the Host tab, menu items (Vehicles, Payment methods, Help, Terms).

### P2: public parking and polish
12. Public Parking Detail (availability bar "128 of 300 spots free", hourly rate) with "Scan QR to pay" and "Buy ticket in app".
13. QR Scan screen: a camera-style viewfinder UI. Tapping "Scan" simulates a successful scan after ~2 seconds, then goes to a payment-success screen. Also a "Enter code manually" input.
14. Polish: loading skeletons, empty states, haptics on key actions, smooth transitions, consistent safe-area handling, no overflowing text on small phones, works at desktop width on web (centered phone-width container, max 430px).

## 7. Demo helpers (important for the live expo)
- Profile -> long-press the app logo (or a visible "Demo tools" row) opens: "Reset demo data", "Skip verification", "Auto-approve all requests".
- A small "Demo / Test mode" badge on Payment and Verification screens so evaluators know integrations are simulated.
- Reset must restore a clean state in under 1 second so the demo can be repeated for every visitor.

## 8. Non-goals
Real KYC/NADRA, real payments, real backend, real-time chat, push notifications, admin panel, multi-city, real insurance. (List these in the README as "post-MVP roadmap".)

## 9. Definition of done
- `npx expo start` runs with no errors, no API keys, and works in Expo Go; `npx expo start --web` also works.
- A visitor can complete the full seeker flow (P0) in under 2 minutes without any dead ends, and the full owner flow (P1) in under 2 minutes.
- No placeholder text such as "Lorem ipsum", no console errors or yellow-box warnings during the demo path, and no unhandled promise rejections.
- UI visually matches /design-reference.
- README includes: install/run steps, a 3-minute demo script (exact taps), demo credentials/tools, and the roadmap list from section 8.

## 10. Working instructions for the agent
Work autonomously. After each phase (P0, P1, P2) run the app, fix errors, and commit. If a library does not work in Expo Go, replace it with a simpler solution rather than leaving it broken. Prefer a working, polished P0 and P1 over a half-finished P2.