import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { hotels, Room } from '@/data/hotels';
import Navbar from '@/components/layout/Navbar';
import RoomCard from '@/components/details/RoomCard';
import { MapPin, Star, Share2, Heart, ShieldCheck, Wifi, Coffee, Wind, Tv, Dumbbell, Waves, Car, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function HotelDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hotel = hotels.find(h => h.id === id);
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(tomorrow);
  const [checkOut, setCheckOut] = useState(nextWeek);

  const handleBook = (room: Room) => {
    if (!checkIn || !checkOut) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }
    navigate('/checkout', { state: { hotel, room, checkIn, checkOut } });
  };

  const handleScrollToRooms = () => {
    document.getElementById('available-rooms')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!hotel) return <div>Hotel not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/search" className="hover:text-primary transition-colors">Hotels</Link>
              <span>/</span>
              <span className="text-gray-900">{hotel.name}</span>
            </nav>
            
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{hotel.name}</h1>
              <div className="flex items-center gap-1 bg-blue-50 text-primary px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-primary" />
                <span className="font-bold">{hotel.stars} Stars</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{hotel.location}</span>
                <button className="text-primary font-bold hover:underline ml-2">Show on map</button>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary text-white font-bold text-sm px-2 py-0.5 rounded-lg">{hotel.rating}</div>
                <span className="text-gray-900 font-bold italic">Excellent Experience</span>
                <span className="text-gray-400 font-medium text-sm">| {hotel.reviewsCount} verified reviews</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Image Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 h-[400px] md:h-[600px] gap-4 mb-12 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="md:col-span-2 md:row-span-2 group overflow-hidden cursor-pointer">
            <img 
              src={hotel.images[0]} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              referrerPolicy="no-referrer"
              alt={`${hotel.name} view 1`}
            />
          </div>
          <div className="hidden md:block group overflow-hidden cursor-pointer">
            <img 
              src={hotel.images[1] || hotel.images[0]} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              referrerPolicy="no-referrer"
              alt={`${hotel.name} view 2`}
            />
          </div>
          <div className="hidden md:block group overflow-hidden cursor-pointer">
            <img 
              src={hotel.images[2] || hotel.images[0]} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              referrerPolicy="no-referrer"
              alt={`${hotel.name} view 3`}
            />
          </div>
          <div className="hidden md:block md:col-span-2 group relative overflow-hidden cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              referrerPolicy="no-referrer"
              alt="More photos"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
              <span className="text-white font-black text-2xl tracking-widest">+12 Photos</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Info Side */}
          <div className="lg:col-span-8">
            {/* Quick Amenities */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
              <h2 className="text-xl font-bold mb-6">Popular Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <div className="p-2 bg-blue-50 rounded-xl text-primary"><Wifi className="w-5 h-5" /></div>
                  Free WiFi
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <div className="p-2 bg-blue-50 rounded-xl text-primary"><Coffee className="w-5 h-5" /></div>
                  Breakfast
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <div className="p-2 bg-blue-50 rounded-xl text-primary"><Waves className="w-5 h-5" /></div>
                  Pool
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <div className="p-2 bg-blue-50 rounded-xl text-primary"><Dumbbell className="w-5 h-5" /></div>
                  Gym
                </div>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50" />
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-black mb-4">About this property</h2>
              <p className="text-gray-600 leading-relaxed font-medium">
                {hotel.description}
                <br /><br />
                Located at the crossroads of luxury and culture, {hotel.name} serves as an urban sanctuary for digital nomads and families alike. Our staff is dedicated to ensuring your stay is seamless, from express check-in to personalized itinerary planning.
              </p>
            </div>

            {/* Room Options */}
            <div id="available-rooms" className="mb-12 scroll-mt-28">
              <h2 className="text-2xl font-black mb-8">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room) => (
                  <RoomCard key={room.id} room={room} onBook={() => handleBook(room)} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Sticky Booking Box */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-2xl overflow-hidden relative"
              >
                <div className="mb-8">
                  <span className="text-xs text-gray-400 font-black uppercase tracking-widest block mb-1">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900">${hotel.price}</span>
                    <span className="text-gray-400 font-bold">/ night</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none mb-1">Check-in</span>
                          <input 
                            type="date" 
                            min={today}
                            value={checkIn} 
                            onChange={(e) => setCheckIn(e.target.value)} 
                            className="bg-transparent text-sm font-bold text-gray-900 outline-none w-full cursor-pointer" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-gray-200" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Clock className="w-5 h-5 text-primary shrink-0 opacity-0" />
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none mb-1">Check-out</span>
                          <input 
                            type="date" 
                            min={checkIn || today}
                            value={checkOut} 
                            onChange={(e) => setCheckOut(e.target.value)} 
                            className="bg-transparent text-sm font-bold text-gray-900 outline-none w-full cursor-pointer" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none mb-1">Security</span>
                        <span className="text-sm font-bold text-gray-900">TripStay Protection</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleScrollToRooms}
                  className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-primary-dark transition-all transform active:scale-[0.98] mb-4">
                  Select a Room
                </button>
                <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-tighter">You won't be charged yet</p>
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-12 -translate-y-12 blur-2xl opacity-60 pointer-events-none" />
              </motion.div>

              <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm"><ShieldCheck className="w-6 h-6 text-primary" /></div>
                  <div>
                    <h4 className="font-bold text-primary text-sm mb-1">Price Match Guarantee</h4>
                    <p className="text-xs text-blue-600/80 font-medium leading-relaxed">Find a lower price elsewhere? We'll match it and give you more rewards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
