export type PropertyType =
  | 'PG'
  | 'Single Room'
  | '1 BHK'
  | '2 BHK'
  | '3 BHK'
  | '4 BHK'
  | '5 BHK'
  | 'Independent House';

export type FurnishingStatus = 'Furnished' | 'Semi Furnished' | 'Unfurnished';

export type AmenityType =
  | 'WiFi'
  | 'Bed'
  | 'AC'
  | 'Parking'
  | 'Kitchen'
  | 'Washing Machine'
  | 'RO Water'
  | 'Study Table'
  | 'Refrigerator'
  | 'CCTV'
  | 'Geyser'
  | 'Power Backup'
  | 'Meals Included';

export interface Property {
  id: string;
  title: string;
  price: number; // Monthly Rent in INR
  type: PropertyType;
  location: string; // Specific area in Phagwara, e.g. "LPU Backside (Law Gate)", "Urban Estate", etc.
  address: string;
  bedrooms: number;
  bathrooms: number;
  furnishing: FurnishingStatus;
  ac: boolean;
  nearLPU: boolean;
  distanceToLPU: string; // e.g., "300m walking", "1.5 km"
  images: string[];
  securityDeposit: number;
  brokerage: number; // 0 for Direct Owner, or brokerage fee
  description: string;
  rating: number;
  reviewsCount: number;
  amenities: AmenityType[];
  size: string; // e.g., "650 sq.ft"
  genderPreference?: 'Boys' | 'Girls' | 'Any' | 'Family'; // mostly for PG & rooms
  hostName: string;
  hostPhone: string;
  hostWhatsApp: string;
  hostAvatar: string;
  featured: boolean;
  addedDate: string; // "YYYY-MM-DD" style
  isSaved?: boolean;
  isAvailable?: boolean;
  isArchived?: boolean;
  videos?: string[];
}

export interface FilterState {
  searchQuery: string;
  propertyType: PropertyType | 'All';
  priceRange: string; // 'All' | '3000-5000' | '5000-8000' | '8000-12000' | '12000+'
  furnishing: FurnishingStatus | 'All';
  acStatus: 'All' | 'AC' | 'Non AC';
  nearLPUOnly: boolean;
  sortBy: 'low-to-high' | 'high-to-low' | 'newest';
}

export interface ContactFormInput {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export type PageId = 'home' | 'properties' | 'saved' | 'contact' | 'details' | 'admin';

export type RoomStatus = 'Available' | 'Reserved' | 'Occupied';

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  roomType: string;
  sharingType: string;
  price: number;
  status: RoomStatus;
  images: string[];
  videos: string[];
}

export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Checked In' | 'Checked Out';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  aadhaar?: string;
  checkInDate: string;
  message?: string;
  propertyId: string;
  propertyTitle: string;
  roomId?: string;
  roomNumber?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
  type: 'contact' | 'whatsapp' | 'property';
  status: 'pending' | 'resolved';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'property' | 'booking' | 'inquiry' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  fullName: string;
  role: 'Super Admin' | 'Property Manager';
  createdAt: string;
}

