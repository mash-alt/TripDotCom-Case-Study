import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import FilterSidebar from '@/components/search/FilterSidebar';
import HotelCard from '@/components/search/HotelCard';
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { motion } from 'motion/react';
import { hotelApi } from '@/api/services';
import type { HotelSummary } from '@/types/api';
import StatusMessage from '@/components/shared/StatusMessage';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isGridView, setIsGridView] = useState(false);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice') ?? 50000));
  const [stars, setStars] = useState(Number(searchParams.get('stars') ?? 0));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hotels, setHotels] = useState<HotelSummary[]>([]);
  const [searchDraft, setSearchDraft] = useState(searchParams.get('q') ?? '');
  const query = searchParams.get('q') ?? '';
  const checkIn = searchParams.get('checkIn') ?? '';
  const checkOut = searchParams.get('checkOut') ?? '';
  const adults = searchParams.get('adults') ?? '2';
  const rooms = searchParams.get('rooms') ?? '1';

  useEffect(() => {
    setIsLoading(true);
    setError('');

    void hotelApi
      .list({
        search: query,
        maxPrice: maxPrice < 50000 ? maxPrice : undefined,
        stars: stars || undefined,
      })
      .then(setHotels)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [query, maxPrice, stars]);

  const filteredHotels = useMemo(() => hotels, [hotels]);

  const handleSearchUpdate = () => {
    const next = new URLSearchParams(searchParams);
    next.set('q', searchDraft);
    next.set('maxPrice', String(maxPrice));
    next.set('stars', String(stars));
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-100 pt-24 pb-4 px-6 fixed top-0 w-full z-40 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 flex items-center focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} className="bg-transparent border-none outline-none w-full text-sm font-semibold" />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 flex items-center">
            <span className="text-sm font-bold text-gray-700">{checkIn || 'Flexible'} - {checkOut || 'Flexible'}</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 flex items-center">
            <span className="text-sm font-bold text-gray-700">{adults} Adults, {rooms} Room</span>
          </div>
          <button onClick={handleSearchUpdate} className="bg-primary text-white font-bold px-6 py-2 rounded-2xl hover:bg-primary-dark transition-colors">
            Update
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-48 pb-20">
        <div className="flex gap-8">
          <FilterSidebar
            maxPrice={maxPrice}
            stars={stars}
            onMaxPriceChange={setMaxPrice}
            onStarsChange={setStars}
            onClear={() => {
              setMaxPrice(50000);
              setStars(0);
            }}
          />

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {filteredHotels.length} Stays in {query || 'All Destinations'}
                </h1>
                <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest">Real-time pricing from the MySQL inventory</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                  <button onClick={() => setIsGridView(false)} className={`p-2 rounded-lg transition-all ${!isGridView ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
                    <List className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsGridView(true)} className={`p-2 rounded-lg transition-all ${isGridView ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                  <span className="text-sm font-bold text-gray-700">Sort by: Rating</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {error ? (
              <StatusMessage title="Search unavailable" description={error} />
            ) : isLoading ? (
              <StatusMessage title="Loading hotels" description="Fetching hotels, rooms, and pricing from the backend." />
            ) : filteredHotels.length === 0 ? (
              <StatusMessage title="No hotels found" description="Try a different destination, wider dates, or a higher price cap." />
            ) : (
              <div className={isGridView ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                {filteredHotels.map((hotel, idx) => (
                  <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <HotelCard hotel={hotel} horizontal={!isGridView} />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-50">
              <button className="bg-gray-900 text-white font-bold flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-transform active:scale-95">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
