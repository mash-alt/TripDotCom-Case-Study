import { useEffect, useState } from 'react';
import Hero from '@/components/home/Hero';
import SearchBar from '@/components/home/SearchBar';
import FeaturedSection from '@/components/home/FeaturedSection';
import Navbar from '@/components/layout/Navbar';
import { hotelApi } from '@/api/services';
import type { HotelSummary } from '@/types/api';
import StatusMessage from '@/components/shared/StatusMessage';

export default function HomePage() {
  const [hotels, setHotels] = useState<HotelSummary[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    void hotelApi
      .list()
      .then(setHotels)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <SearchBar />
        {error ? (
          <div className="px-4">
            <StatusMessage title="Unable to load hotels" description={error} />
          </div>
        ) : (
          <FeaturedSection hotels={hotels} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="max-w-xs">
            <h2 className="text-xl font-bold mb-4">Trip<span className="text-primary italic">Stay</span></h2>
            <p className="text-gray-500 text-sm">Simplifying hotel booking with real-time inventory, flexible payments, loyalty rewards, and responsive support.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 flex-1">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                <li className="hover:text-primary cursor-pointer">Help Center</li>
                <li className="hover:text-primary cursor-pointer">Refund Policy</li>
                <li className="hover:text-primary cursor-pointer">Booking Changes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                <li className="hover:text-primary cursor-pointer">Our Story</li>
                <li className="hover:text-primary cursor-pointer">Careers</li>
                <li className="hover:text-primary cursor-pointer">Partners</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                <li className="hover:text-primary cursor-pointer">Privacy</li>
                <li className="hover:text-primary cursor-pointer">Terms of Use</li>
                <li className="hover:text-primary cursor-pointer">Cookies</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-widest">
          <span>© 2026 TripStay Technologies. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer">Twitter</span>
            <span className="hover:text-primary cursor-pointer">Instagram</span>
            <span className="hover:text-primary cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
