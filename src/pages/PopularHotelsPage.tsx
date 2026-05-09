import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hotelApi } from '@/api/services';
import type { HotelSummary } from '@/types/api';
import HotelCard from '@/components/search/HotelCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PopularHotelsPage() {
  const [hotels, setHotels] = useState<HotelSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchHotels = async () => {
      try {
        // Fetching with high stars filter or just sorted by rating in backend
        const data = await hotelApi.list({ stars: 4 });
        // Sorting by rating locally just in case
        const sorted = [...data].sort((a, b) => b.rating - a.rating);
        setHotels(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load popular hotels.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchHotels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-semibold transition-colors mb-6 group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-accent mb-3"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-xs">Trending Stays</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight"
                >
                  Most Popular <span className="text-primary italic">Hotels</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-500 font-medium mt-4 max-w-2xl text-lg"
                >
                  Experience luxury and comfort at our top-rated destinations. These stays are consistently chosen by travelers for their exceptional service and premium amenities.
                </motion.p>
              </div>

              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="text-right">
                  <span className="block text-xs font-bold text-gray-400 uppercase">Average Rating</span>
                  <span className="text-2xl font-black text-gray-900">4.8/5.0</span>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Star className="text-accent fill-accent w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-2xl aspect-[4/5]" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
              <p className="text-red-600 font-bold text-lg">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 text-primary font-bold hover:underline">Try Again</button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {hotels.map((hotel, idx) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && hotels.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <h3 className="text-xl font-bold text-gray-400">No popular hotels found at the moment.</h3>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
