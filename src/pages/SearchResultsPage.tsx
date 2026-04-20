import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import FilterSidebar from '@/components/search/FilterSidebar';
import HotelCard from '@/components/search/HotelCard';
import { hotels } from '@/data/hotels';
import { Search, SlidersHorizontal, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { motion } from 'motion/react';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isGridView, setIsGridView] = useState(false);

  // Filter hotels based on query (simple mock filtering)
  const filteredHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(query.toLowerCase()) || 
    h.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Sub-search bar for search page */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-4 px-6 fixed top-0 w-full z-40 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 flex items-center focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input type="text" defaultValue={query} className="bg-transparent border-none outline-none w-full text-sm font-semibold" />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-sm font-bold text-gray-700">Apr 20 - Apr 25, 2026</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-sm font-bold text-gray-700">2 Adults, 1 Room</span>
          </div>
          <button className="bg-primary text-white font-bold px-6 py-2 rounded-2xl hover:bg-primary-dark transition-colors">
            Update
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-48 md:pt-48 pb-20">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <FilterSidebar />

          {/* Main Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {filteredHotels.length} Stays in {query || 'All Destinations'}
                </h1>
                <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest">Pricing includes taxes and fees</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                  <button 
                    onClick={() => setIsGridView(false)}
                    className={`p-2 rounded-lg transition-all ${!isGridView ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setIsGridView(true)}
                    className={`p-2 rounded-lg transition-all ${isGridView ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-50 shadow-sm">
                  <span className="text-sm font-bold text-gray-700">Sort by: Popularity</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Hotel List */}
            <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
              {filteredHotels.map((hotel, idx) => (
                <motion.div
                  key={hotel.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <HotelCard hotel={hotel} horizontal={!isGridView} />
                </motion.div>
              ))}
            </div>

            {/* Mobile Filter Trigger */}
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
