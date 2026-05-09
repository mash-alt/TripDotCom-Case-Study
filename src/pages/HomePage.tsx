import { useEffect, useState } from 'react';
import Hero from '@/components/home/Hero';
import SearchBar from '@/components/home/SearchBar';
import FeaturedSection from '@/components/home/FeaturedSection';
import Navbar from '@/components/layout/Navbar';
import { hotelApi } from '@/api/services';
import type { HotelSummary } from '@/types/api';
import StatusMessage from '@/components/shared/StatusMessage';
import Footer from '@/components/layout/Footer';

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

      <Footer />
    </div>
  );
}
