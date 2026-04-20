import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function SearchBar() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [isSelectingGuests, setIsSelectingGuests] = useState(false);
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${destination}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 md:p-8 -mt-24 md:-mt-32 relative z-10"
      >
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Destination */}
          <div className="md:col-span-4 relative group">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Destination</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <MapPin className="text-primary w-5 h-5 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="bg-transparent border-none outline-none w-full text-gray-900 font-medium placeholder:text-gray-400"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="md:col-span-4 grid grid-cols-2 gap-2">
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Check-in</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                <Calendar className="text-primary w-5 h-5 mr-3 shrink-0" />
                <span className="text-gray-900 font-medium truncate">Apr 20, 2026</span>
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Check-out</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                <Calendar className="text-primary w-5 h-5 mr-3 shrink-0" />
                <span className="text-gray-900 font-medium truncate">Apr 25, 2026</span>
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Guests & Rooms</label>
            <div 
              onClick={() => setIsSelectingGuests(!isSelectingGuests)}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-3 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center overflow-hidden">
                <Users className="text-primary w-5 h-5 mr-3 shrink-0" />
                <span className="text-gray-900 font-medium truncate">
                  {guests.rooms} Room, {guests.adults + guests.children} Pers
                </span>
              </div>
              <ChevronDown className="text-gray-400 w-4 h-4 shrink-0" />
            </div>

            {/* Guests Dropdown */}
            <AnimatePresence>
              {isSelectingGuests && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 z-50"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">Rooms</span>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setGuests(prev => ({...prev, rooms: Math.max(1, prev.rooms - 1)}))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                        <span className="w-4 text-center font-bold">{guests.rooms}</span>
                        <button type="button" onClick={() => setGuests(prev => ({...prev, rooms: prev.rooms + 1}))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">Adults</span>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setGuests(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">-</button>
                        <span className="w-4 text-center font-bold">{guests.adults}</span>
                        <button type="button" onClick={() => setGuests(prev => ({...prev, adults: prev.adults + 1}))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">+</button>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setIsSelectingGuests(false)}
                      className="w-full bg-primary text-white font-bold py-2 rounded-xl mt-2"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button */}
          <div className="md:col-span-1 flex items-end">
            <button 
              type="submit"
              className="w-full h-[52px] bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary-dark transition-all shadow-lg shadow-blue-500/40"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
