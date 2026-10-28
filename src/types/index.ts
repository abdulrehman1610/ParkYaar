export type UserMode = 'seeker' | 'owner';

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  verified: boolean;
  rating: number;
  mode: UserMode;
  memberSince: string;
  totalStays: number;
}

export type VehicleType = 'car' | 'bike' | 'suv';

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  type: VehicleType;
  isPrimary: boolean;
  color?: string;
}

export type SpotType = 'private' | 'public';

export interface Listing {
  id: string;
  type: SpotType;
  title: string;
  area: string;
  address: string;
  distance: string;
  walkTime: string;
  lat: number;
  lng: number;
  photos: string[];
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  features: string[];
  hostName: string;
  hostPhoto: string;
  hostVerified: boolean;
  hostResponseTime: string;
  hostSince: string;
  rating: number;
  reviewCount: number;
  instantBook: boolean;
  totalSpots?: number;
  freeSpots?: number;
  vehicleTypes: VehicleType[];
  isCovered: boolean;
  cctv: boolean;
  accessProtocol: string;
  isActive?: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingArea: string;
  listingAddress: string;
  listingPhoto: string;
  hostName: string;
  hostPhoto: string;
  hostPhone: string;
  vehicle: Vehicle;
  date: string;
  startTime: string;
  hours: number;
  hourlyRate: number;
  serviceFee: number;
  discount: number;
  total: number;
  status: BookingStatus;
  paymentMethod: string;
  qrCode: string;
  pin: string;
  bayNumber: string;
  createdAt: string;
  durationLabel: string;
}

export interface HostStats {
  monthlyEarnings: number;
  occupancyRate: number;
  totalBookings: number;
  activeSpots: number;
  rating: number;
  weeklyEarnings: { day: string; amount: number }[];
}

export interface KycDocuments {
  cnicFront: string | null;
  cnicBack: string | null;
  licence: string | null;
  selfie: string | null;
  submittedAt: string | null;
  isApproved: boolean;
}
