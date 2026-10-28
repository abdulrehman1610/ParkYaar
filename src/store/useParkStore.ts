import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { INITIAL_BOOKINGS, INITIAL_LISTINGS, INITIAL_USER, INITIAL_VEHICLES } from '@/constants/seedData';
import { Booking, BookingStatus, KycDocuments, Listing, SpotType, User, UserMode, Vehicle, VehicleType } from '@/types';

interface ParkState {
  // User & KYC
  user: User;
  kycDocuments: KycDocuments;
  setUserMode: (mode: UserMode) => void;
  updateUser: (partial: Partial<User>) => void;
  updateKycDocuments: (docs: Partial<KycDocuments>) => void;
  approveKyc: () => void;

  // Vehicles
  vehicles: Vehicle[];
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;

  // Listings
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id'>) => string;
  toggleListingActive: (id: string) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => string;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  cancelBooking: (id: string) => void;

  // Filters & Search
  selectedSpotType: SpotType;
  setSelectedSpotType: (type: SpotType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedVehicleFilter: VehicleType | 'all';
  setSelectedVehicleFilter: (filter: VehicleType | 'all') => void;
  coveredFilter: boolean;
  setCoveredFilter: (val: boolean) => void;
  maxPriceFilter: number | null;
  setMaxPriceFilter: (val: number | null) => void;

  // Demo Helpers
  autoApproveRequests: boolean;
  toggleAutoApproveRequests: () => void;
  resetDemoData: () => void;
  skipVerification: () => void;
}

const DEFAULT_KYC: KycDocuments = {
  cnicFront: null,
  cnicBack: null,
  licence: null,
  selfie: null,
  submittedAt: null,
  isApproved: true,
};

export const useParkStore = create<ParkState>()(
  persist(
    (set, get) => ({
      // User & KYC
      user: INITIAL_USER,
      kycDocuments: DEFAULT_KYC,
      setUserMode: (mode) =>
        set((state) => ({
          user: { ...state.user, mode },
        })),
      updateUser: (partial) =>
        set((state) => ({
          user: { ...state.user, ...partial },
        })),
      updateKycDocuments: (docs) =>
        set((state) => ({
          kycDocuments: { ...state.kycDocuments, ...docs },
        })),
      approveKyc: () =>
        set((state) => ({
          kycDocuments: { ...state.kycDocuments, isApproved: true },
          user: { ...state.user, verified: true },
        })),

      // Vehicles
      vehicles: INITIAL_VEHICLES,
      selectedVehicleId: INITIAL_VEHICLES[0].id,
      setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
      addVehicle: (vehicleData) => {
        const id = `veh-${Date.now()}`;
        const newVehicle: Vehicle = { ...vehicleData, id };
        set((state) => ({
          vehicles: [...state.vehicles, newVehicle],
          selectedVehicleId: id,
        }));
      },

      // Listings
      listings: INITIAL_LISTINGS,
      addListing: (listingData) => {
        const id = `spot-usr-${Date.now()}`;
        const newListing: Listing = {
          ...listingData,
          id,
          isActive: true,
        };
        set((state) => ({
          listings: [newListing, ...state.listings],
        }));
        return id;
      },
      toggleListingActive: (id) =>
        set((state) => ({
          listings: state.listings.map((l) =>
            l.id === id ? { ...l, isActive: !(l.isActive ?? true) } : l
          ),
        })),

      // Bookings
      bookings: INITIAL_BOOKINGS,
      addBooking: (bookingData) => {
        const id = `PY-${Math.floor(1000 + Math.random() * 9000)}`;
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        const newBooking: Booking = {
          ...bookingData,
          id,
          pin,
          qrCode: `${id}-${bookingData.bayNumber}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          bookings: [newBooking, ...state.bookings],
        }));
        return id;
      },
      updateBookingStatus: (id, status) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status } : b
          ),
        })),
      cancelBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status: 'cancelled' } : b
          ),
        })),

      // Filters & Search
      selectedSpotType: 'private',
      setSelectedSpotType: (selectedSpotType) => set({ selectedSpotType }),
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      selectedVehicleFilter: 'all',
      setSelectedVehicleFilter: (selectedVehicleFilter) =>
        set({ selectedVehicleFilter }),
      coveredFilter: false,
      setCoveredFilter: (coveredFilter) => set({ coveredFilter }),
      maxPriceFilter: null,
      setMaxPriceFilter: (maxPriceFilter) => set({ maxPriceFilter }),

      // Demo Helpers
      autoApproveRequests: true,
      toggleAutoApproveRequests: () =>
        set((state) => ({
          autoApproveRequests: !state.autoApproveRequests,
        })),
      resetDemoData: () => {
        set({
          user: INITIAL_USER,
          kycDocuments: DEFAULT_KYC,
          vehicles: INITIAL_VEHICLES,
          selectedVehicleId: INITIAL_VEHICLES[0].id,
          listings: INITIAL_LISTINGS,
          bookings: INITIAL_BOOKINGS,
          selectedSpotType: 'private',
          searchQuery: '',
          selectedVehicleFilter: 'all',
          coveredFilter: false,
          maxPriceFilter: null,
        });
      },
      skipVerification: () => {
        set((state) => ({
          user: { ...state.user, verified: true },
          kycDocuments: { ...state.kycDocuments, isApproved: true },
        }));
      },
    }),
    {
      name: 'parkyaar-storage-v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
