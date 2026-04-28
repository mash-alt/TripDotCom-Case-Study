import { ApiError } from './apiError.js';

export function calculateNights(checkInDate: string, checkOutDate: string) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffInMs = checkOut.getTime() - checkIn.getTime();
  const nights = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (Number.isNaN(nights) || nights <= 0) {
    throw new ApiError(400, 'Check-out date must be after check-in date.');
  }

  return nights;
}

export function isRefundEligible(checkInDate: string) {
  const checkIn = new Date(checkInDate).getTime();
  const now = Date.now();
  const fortyEightHours = 1000 * 60 * 60 * 48;
  return checkIn - now >= fortyEightHours;
}

export function calculateMembershipLevel(points: number) {
  if (points >= 5000) return 'Platinum' as const;
  if (points >= 2500) return 'Gold' as const;
  if (points >= 1000) return 'Silver' as const;
  return 'Bronze' as const;
}
