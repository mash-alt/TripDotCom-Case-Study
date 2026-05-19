/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from '@/pages/HomePage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import HotelDetailsPage from '@/pages/HotelDetailsPage';
import CheckoutPage from '@/pages/CheckoutPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HotelPartnerAuthPage from '@/pages/HotelPartnerAuthPage';
import BookingHistoryPage from '@/pages/account/BookingHistoryPage';
import SupportPage from '@/pages/SupportPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import HotelOwnerDashboardPage from '@/pages/admin/HotelOwnerDashboardPage';
import HotelStaffDashboardPage from '@/pages/admin/HotelStaffDashboardPage';
import PopularHotelsPage from '@/pages/PopularHotelsPage';
import LoyaltyPage from '@/pages/LoyaltyPage';
import ProtectedRoute from '@/components/app/ProtectedRoute';
import { Toaster } from 'sonner';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/popular" element={<PopularHotelsPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route
        path="/loyalty"
        element={(
          <ProtectedRoute roles={['customer']}>
            <LoyaltyPage />
          </ProtectedRoute>
        )}
      />
      <Route path="/hotel/:id" element={<HotelDetailsPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/internal/hotel-access" element={<HotelPartnerAuthPage />} />
      <Route
        path="/bookings"
        element={(
          <ProtectedRoute roles={['customer']}>
            <BookingHistoryPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/support"
        element={(
          <ProtectedRoute roles={['customer', 'admin', 'hotel_owner', 'hotel_staff']}>
            <SupportPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin"
        element={(
          <ProtectedRoute roles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/owner"
        element={(
          <ProtectedRoute roles={['hotel_owner']}>
            <HotelOwnerDashboardPage />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/staff"
        element={(
          <ProtectedRoute roles={['hotel_staff']}>
            <HotelStaffDashboardPage />
          </ProtectedRoute>
        )}
      />
      {/* 404 Fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" expand={false} richColors />
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
