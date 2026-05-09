import { apiRequest } from './client';
import type {
  AuthSession,
  Booking,
  HotelDetails,
  HotelSummary,
  LoyaltySummary,
  PaymentResult,
  Room,
  SupportTicket,
} from '@/types/api';

export const authApi = {
  register: (payload: { fullName: string; email: string; phoneNumber?: string; password: string }) =>
    apiRequest<AuthSession>('/api/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string; role?: 'customer' | 'admin' }) =>
    apiRequest<AuthSession>('/api/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  me: (token: string) => apiRequest<AuthSession>('/api/auth/me', {}, token),
};

export const hotelApi = {
  list: (params?: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        query.set(key, String(value));
      }
    });

    return apiRequest<HotelSummary[]>(`/api/hotels${query.size ? `?${query.toString()}` : ''}`);
  },
  get: (id: number) => apiRequest<HotelDetails>(`/api/hotels/${id}`),
  create: (payload: Partial<HotelDetails>, token: string) =>
    apiRequest<HotelDetails>(
      '/api/hotels',
      { method: 'POST', body: JSON.stringify(payload) },
      token,
    ),
  update: (id: number, payload: Partial<HotelDetails>, token: string) =>
    apiRequest<HotelDetails>(
      `/api/hotels/${id}`,
      { method: 'PUT', body: JSON.stringify(payload) },
      token,
    ),
  remove: (id: number, token: string) =>
    apiRequest<void>(`/api/hotels/${id}`, { method: 'DELETE' }, token),
};

export const roomApi = {
  list: (hotelId?: number) =>
    apiRequest<Room[]>(hotelId ? `/api/rooms?hotelId=${hotelId}` : '/api/rooms'),
  get: (id: number) => apiRequest<Room>(`/api/rooms/${id}`),
  create: (payload: Partial<Room>, token: string) =>
    apiRequest<Room>('/api/rooms', { method: 'POST', body: JSON.stringify(payload) }, token),
  update: (id: number, payload: Partial<Room>, token: string) =>
    apiRequest<Room>(`/api/rooms/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token),
  remove: (id: number, token: string) =>
    apiRequest<void>(`/api/rooms/${id}`, { method: 'DELETE' }, token),
};

export const bookingApi = {
  create: (payload: { roomId: number; checkInDate: string; checkOutDate: string; coinsRedeemed?: number }, token: string) =>
    apiRequest<Booking>('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }, token),
  listForCustomer: (customerId: number, token: string) =>
    apiRequest<Booking[]>(`/api/bookings/${customerId}`, {}, token),
  listAll: (token: string) => apiRequest<Booking[]>('/api/bookings', {}, token),
  cancel: (bookingId: number, reason: string, token: string) =>
    apiRequest<Booking>(
      `/api/bookings/${bookingId}/cancel`,
      { method: 'PATCH', body: JSON.stringify({ reason }) },
      token,
    ),
  complete: (bookingId: number, token: string) =>
    apiRequest<Booking>(`/api/bookings/${bookingId}/complete`, { method: 'PATCH' }, token),
};

export const paymentApi = {
  pay: (
    payload: { bookingId: number; amount: number; paymentMethod: string; cardLast4: string },
    token: string,
  ) => apiRequest<PaymentResult>('/api/payments', { method: 'POST', body: JSON.stringify(payload) }, token),
};

export const refundApi = {
  request: (payload: { bookingId: number; reason: string }, token: string) =>
    apiRequest<Booking>('/api/refunds', { method: 'POST', body: JSON.stringify(payload) }, token),
};

export const supportApi = {
  list: (token: string) => apiRequest<SupportTicket[]>('/api/support', {}, token),
  create: (payload: { bookingId?: number | null; subject: string; message: string }, token: string) =>
    apiRequest<SupportTicket>('/api/support', { method: 'POST', body: JSON.stringify(payload) }, token),
  resolve: (
    supportId: number,
    payload: { status: 'InProgress' | 'Resolved'; resolutionNotes?: string },
    token: string,
  ) => apiRequest<SupportTicket>(`/api/support/${supportId}`, { method: 'PATCH', body: JSON.stringify(payload) }, token),
};

export const loyaltyApi = {
  get: (customerId: number, token: string) => apiRequest<LoyaltySummary>(`/api/loyalty/${customerId}`, {}, token),
};
