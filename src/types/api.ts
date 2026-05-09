export type UserRole = 'customer' | 'admin';

export interface SessionUser {
  id: number;
  role: UserRole;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  loyaltyPoints?: number;
  membershipLevel?: 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Diamond+' | 'Black Diamond';
  createdAt?: string | Date;
}

export interface AuthSession {
  token: string;
  user: SessionUser;
}

export interface HotelSummary {
  id: number;
  adminId: number;
  name: string;
  city: string;
  country: string;
  address: string;
  location: string;
  description: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  basePrice: number;
  heroImage: string | null;
  amenities: string[];
}

export interface Room {
  id: number;
  hotelId: number;
  hotelName?: string;
  name: string;
  roomType: string;
  description: string;
  bedType: string;
  sizeSqm: number;
  capacityAdults: number;
  capacityChildren: number;
  pricePerNight: number;
  totalInventory: number;
  imageUrl: string | null;
  amenities: string[];
}

export interface HotelDetails extends HotelSummary {
  images: string[];
  rooms: Room[];
}

export interface Booking {
  bookingId: number;
  customerId: number;
  roomId: number;
  hotelId: number;
  hotelName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
  bookingStatus: 'PendingPayment' | 'Confirmed' | 'CheckedIn' | 'Cancelled' | 'Completed';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded' | null;
  refundStatus: 'Requested' | 'Approved' | 'Rejected' | 'Processed' | null;
  discountApplied: number;
  customerName: string;
  customerEmail: string;
  internalNotes: string | null;
  createdAt: string;
}

export interface PaymentResult {
  booking: Booking;
  payment: {
    paymentId: number;
    bookingId: number;
    amount: number;
    paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
    paymentMethod: string;
    transactionReference: string | null;
    paidAt: string | null;
  } | null;
}

export interface SupportTicket {
  supportId: number;
  customerId: number;
  bookingId: number | null;
  adminId: number | null;
  subject: string;
  message: string;
  status: 'Open' | 'InProgress' | 'Resolved';
  resolutionNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltySummary {
  customerId: number;
  points: number;
  membershipLevel: 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Diamond+' | 'Black Diamond';
}
