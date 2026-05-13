import React from 'react';
import { motion } from 'motion/react';
import HotelCard from '@/components/search/HotelCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { HotelSummary } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';

interface FeaturedSectionProps {
  hotels: HotelSummary[];
}

export default function FeaturedSection({ hotels }: FeaturedSectionProps) {
  const { user } = useAuth();
  const destinations = hotels.reduce<Record<string, { name: string; count: number; image: string | null }>>((acc, hotel) => {
    const existing = acc[hotel.city];
    acc[hotel.city] = {
      name: hotel.city,
      count: (existing?.count ?? 0) + 1,
      image: existing?.image ?? hotel.heroImage,
    };
    return acc;
  }, {});

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Popular Stays Worldwide</h2>
              <p className="text-gray-500 font-medium max-w-xl">Curated collection of the most sought-after hotels based on traveler reviews and demand.</p>
            </div>
            <Link to="/popular" className="flex items-center gap-1 text-primary font-bold hover:underline">
              View all popular hotels <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.slice(0, 4).map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Top Destinations</h2>
              <p className="text-gray-500 font-medium max-w-xl">Explore the world&apos;s most vibrant cities and serene retreats.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.values(destinations).slice(0, 6).map((dest, idx) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-[3/4]"
              >
                <img
                  src={dest.image ?? 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800'}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold mb-0.5">{dest.name}</h3>
                  <p className="text-xs text-white/70 font-medium">{dest.count} Hotels</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 relative rounded-[2rem] overflow-hidden bg-primary px-8 md:px-16 py-12 md:py-20 text-white shadow-2xl shadow-blue-500/20"
        >
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Unlock Secret Deals of Up to 40% Off</h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 font-medium">Join our Trip.com Rewards program and start saving on your next journey. Exclusive member rates across our global hotel network.</p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to={user ? "/loyalty" : "/register"} 
                className="bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10 inline-block"
              >
                Join Rewards Now
              </Link>
              <Link 
                to="/loyalty" 
                className="bg-primary-dark/30 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary-dark/50 transition-colors inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
