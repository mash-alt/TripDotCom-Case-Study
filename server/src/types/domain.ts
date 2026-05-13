export type UserRole = 'customer' | 'admin' | 'hotel_owner' | 'hotel_staff';

export interface AuthUser {
  id: number;
  role: UserRole;
  fullName: string;
  email: string;
  ownerId?: number | null;
}

export interface LoyaltySummary {
  customerId: number;
  points: number;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}
