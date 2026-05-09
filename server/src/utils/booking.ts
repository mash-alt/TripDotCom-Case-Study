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

export function isRefundEligible(checkInDate: string, createdAt?: Date) {
  const checkIn = new Date(checkInDate).getTime();
  const now = Date.now();
  
  // Rule 1: Cannot refund if the stay has already started
  if (now > checkIn) return false;

  // Rule 2: 30-minute grace period for new bookings
  if (createdAt) {
    const createdTime = new Date(createdAt).getTime();
    const thirtyMinutes = 1000 * 60 * 30;
    if (now - createdTime <= thirtyMinutes) return true;
  }

  // Rule 3: Must be at least 48 hours before check-in
  const fortyEightHours = 1000 * 60 * 60 * 48;
  return checkIn - now >= fortyEightHours;
}

export function calculateMembershipLevel(points: number) {
  if (points >= 50000) return 'Black Diamond' as const;
  if (points >= 25000) return 'Diamond+' as const;
  if (points >= 10000) return 'Diamond' as const;
  if (points >= 3000) return 'Platinum' as const;
  if (points >= 1000) return 'Gold' as const;
  return 'Silver' as const;
}

export function calculateTripCoinsEarned(amount: number, tier: string) {
  // Base: ~50 Trip Coins per $100 spent (0.5 coins per $1)
  const baseRate = 0.5;
  const baseCoins = amount * baseRate;

  let multiplier = 1.0;
  switch (tier) {
    case 'Gold': multiplier = 1.2; break;
    case 'Platinum': multiplier = 1.5; break;
    case 'Diamond': multiplier = 2.0; break;
    case 'Diamond+': multiplier = 2.5; break;
    case 'Black Diamond': multiplier = 3.0; break;
    default: multiplier = 1.0; // Silver
  }

  return Math.floor(baseCoins * multiplier);
}
