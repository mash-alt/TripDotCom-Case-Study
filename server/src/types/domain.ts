export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: number;
  role: UserRole;
  fullName: string;
  email: string;
}

export interface LoyaltySummary {
  customerId: number;
  points: number;
  membershipLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}
