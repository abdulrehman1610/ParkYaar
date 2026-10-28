# ParkYaar — Peer-to-Peer Parking Marketplace (Lahore, PK)

A demo-ready, cross-platform mobile application built with **React Native** and **Expo SDK 52** for university project expo evaluation.

ParkYaar solves street congestion and high parking friction in urban Pakistan by connecting vehicle drivers with private driveway owners and verified commercial parking plazas in Lahore.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run on Laptop Web (Evaluator Desktop Mode)
```bash
npx expo start --web
```
> The web interface automatically renders within a **centered mobile frame** (`maxWidth: 430px`) on desktop monitors so evaluators see the exact smartphone layout without distorted elements.

### 3. Run on Mobile (Expo Go)
```bash
npx expo start
```
Scan the QR code with:
- **Android**: Expo Go app
- **iOS**: Camera app -> Open in Expo Go

---

## 🎨 Design System & Visual Authority

Designed strictly to match the **ParkYaar Modern Utilitarian Transit** design specifications (`/Design`):

- **Primary Navy (`#0B2545`)**: Structural anchors, brand headers, active filter chips.
- **Parking Blue (`#1F6FEB`)**: Primary 52px full-width pill CTAs, verified badges, active tab markers, private P2P pins.
- **Amber Accent (`#F5A623` / `#FFDDB4`)**: Commercial/public lots, star ratings, promo tags, and host "EARN" badge.
- **Slate Canvas (`#F4F6F8`) & Pure White (`#FFFFFF`)**: Ambient soft shadows (`0px 4px 16px rgba(11, 37, 69, 0.06)`), 16px card radius, 24px top sheet radius.
- **Pakistani Currency Standard**: All tariffs formatted with tabular tracking and Pakistani Rupee prefix: `Rs 150/hr`.

---

## 📱 3-Minute Live Expo Demo Script (Exact Taps)

Follow this exact sequence to demonstrate the complete seeker and owner flows without dead ends:

### Step 1: Onboarding & KYC Simulation (0:00 - 0:30)
1. Launch app -> Observe the **1.5s animated splash screen** with the ParkYaar brand emblem.
2. On the **Login screen**, see the prefilled Pakistani mobile number `+92 300 8472910` -> Tap **"Get Verification Code"**.
3. On the **OTP screen**, notice the prefilled 6-digit code `123456` -> Tap **"Verify & Continue"**.
4. On the **Verification screen**, observe the 4 upload cards (CNIC Front, CNIC Back, Driving Licence, Live Selfie) and security encryption note -> Tap **"Submit for Verification"**.
5. Watch the **3-second NADRA verification spinner** auto-approve with the verified shield badge -> Tap **"Start Exploring Lahore"**.

### Step 2: Explore Map & Spot Details (0:30 - 1:15)
1. On the **Explore tab**, see the stylized Lahore transit vector map (Liberty Roundabout, MM Alam Road, Main Boulevard Gulberg, Gaddafi Stadium) with live user pulse and price pins.
2. Tap the segmented toggle **"Public & Corporate"** to filter commercial plazas (e.g. Liberty Plaza, Emporium Mall). Tap back to **"Private Driveways"**.
3. Tap filter chips: `Car`, `Covered`, `Under Rs 200` to see real-time filtering.
4. Tap the featured card: **"Covered Garage near Liberty Market"** (or tap its `Rs 150` pin on the map).
5. On the **Spot Details screen**, swipe through the 4-photo gallery carousel, inspect the verified host card for Sana Malik, view the 6 amenity tiles, toggle between **Hourly (Rs 150/hr)**, **Full Day (Rs 900)**, and **Monthly (Rs 15,000)** tiers.
6. Tap **"Contact"** to test the in-app chat modal with instant reply simulations.
7. Tap the sticky CTA **"Book This Spot"**.

### Step 3: Booking Schedule & Test Payment (1:15 - 1:45)
1. On the **Schedule screen**, see your registered `Honda Civic (White) • LEA-1234` pre-selected.
2. Tap `+` and `-` on the **Parking Duration stepper** (e.g. 3 Hours) to observe live departure calculation (*"Until 06:00 PM today"*) and transparent fare breakdown with `-Rs 50` PKFIRST promo discount.
3. Tap **"Continue to Payment • Rs 430"**.
4. In the **Payment modal**, select **JazzCash Wallet** (notice the prominent *Sandbox Mode* badge). Tap **"Confirm & Pay Rs 430"**.
5. Watch the 2-second simulated gateway animation transition to the active pass.

### Step 4: Active Digital Parking Pass (1:45 - 2:15)
1. Inspect the **Booking Confirmed (#PY-7842)** screen:
   - High-contrast scannable QR code.
   - **Live countdown timer** (`02h 48m 15s`) ticking in real time.
   - Backup manual gate PIN `4892` -> Tap the copy button to see the *"PIN copied to clipboard!"* toast.
2. Tap **"Navigate"** to demonstrate launching Google Maps with the listing's coordinates.
3. Tap **"Call Host"** to view masked caller privacy.
4. Tap **"Extend Parking Time (+1 hr Rs 150)"** to see duration increment dynamically.

### Step 5: Host Side & Earnings (2:15 - 2:45)
1. Tap the **Host tab** in the bottom bar.
2. View the **Monthly Earnings Hero Card (Rs 48,500)** with interactive weekly bar chart and 84% occupancy rate.
3. View **"Pending Requests"** -> Tap **"Approve Request"** to immediately confirm a pending booking.
4. In **"My Managed Spaces"**, toggle the **Live / Paused** switch to see instantaneous listing availability state changes.
5. Tap **"List a New Space"** to view the Add Listing wizard, select Lahore area (Gulberg II, DHA 5, Model Town), set hourly rates, and tap **"Publish Listing Now"** to immediately make it live on the Explore map.

### Step 6: Evaluator Demo Reset (2:45 - 3:00)
1. Go to the **Profile tab** (or long-press the ParkYaar logo in the top header).
2. Tap **"Expo Demo Tools"** -> Tap **"Reset Demo Data"**.
3. In under 1 second, all seed data, vehicles, and past bookings are restored to a clean state, ready for the next evaluator!

---

## 🛠️ Demo Tools & Evaluator Helpers

Accessible via the **Profile tab** or by tapping the **"Demo"** pill in the top header:
- **Instant Data Reset**: Restores initial state (10 private spots, 4 public lots, 2 vehicles, 2 past bookings) in < 1 second.
- **Skip Verification**: Immediately grants verified status without document re-upload.
- **Auto-Approve Requests Toggle**: Toggles automatic confirmation of seeker requests.
- **Switch Active Mode**: Toggles between Driver and Host perspectives.

---

## 🗺️ Post-MVP Production Roadmap

As defined in the project scope, the following integrations are reserved for production release:
- Real NADRA Verisys biometric API integration
- Production 1LINK / PayFast / JazzCash direct merchant checkout
- Real-time WebSockets host chat and push notifications
- Admin moderation and dispute resolution portal
- Multi-city expansion (Islamabad, Rawalpindi, Karachi)
- Vehicle insurance underwriter partnership (EFU / Jubilee)
