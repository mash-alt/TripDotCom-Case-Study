import React from 'react';
import { motion } from 'motion/react';
import { destinations, hotels } from '@/data/hotels';
import HotelCard from '@/components/search/HotelCard';
import { ChevronRight } from 'lucide-react';

export default function FeaturedSection() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Popular Hotels Section */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Popular Stays Worldwide</h2>
              <p className="text-gray-500 font-medium max-w-xl">Curated collection of the most sought-after hotels based on traveler reviews and demand.</p>
            </div>
            <button className="flex items-center gap-1 text-primary font-bold hover:underline">
              View all popular hotels <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>

        {/* Featured Destinations Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Top Destinations</h2>
              <p className="text-gray-500 font-medium max-w-xl">Explore the world's most vibrant cities and serene retreats.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-[3/4]"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold mb-0.5">{dest.name}</h3>
                  <p className="text-xs text-white/70 font-medium">{dest.count} Properties</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Promotion Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 relative rounded-[2rem] overflow-hidden bg-primary px-8 md:px-16 py-12 md:py-20 text-white shadow-2xl shadow-blue-500/20"
        >
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Unlock Secret Deals of Up to 40% Off</h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 font-medium">Join our TripStay Rewards program and start saving on your next journey. Exclusive member rates across 1M+ hotels.</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10">Join Rewards Now</button>
              <button className="bg-primary-dark/30 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary-dark/50 transition-colors">Learn More</button>
            </div>
          </div>
          {/* Abstract circles for decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
}
