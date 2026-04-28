import React from 'react';
import { User, Bed, Maximize } from 'lucide-react';
import { Room } from '@/data/hotels';
import { motion } from 'motion/react';

interface RoomCardProps {
  room: Room;
  onBook: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row mb-6"
    >
      {/* Room Photo Placeholder */}
      <div className="md:w-72 bg-gray-100 aspect-video md:aspect-auto flex items-center justify-center text-gray-400">
        <img 
          src={`https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400`} 
          alt={room.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4" />
              <span>{room.occupancy} Adults</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Bed className="w-4 h-4" />
              <span>{room.beds}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Maximize className="w-4 h-4" />
              <span>{room.size}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2">
            {room.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 text-xs text-green-600 font-bold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                {amenity}
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-56 md:border-l md:border-gray-50 md:pl-6 flex flex-col justify-center items-end md:items-start gap-4">
          <div className="text-right md:text-left">
            <span className="text-xs text-gray-400 block font-bold uppercase">Member Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-gray-900">${room.price}</span>
              <span className="text-sm text-gray-400 font-bold">/ night</span>
            </div>
            <p className="text-[10px] text-green-500 font-black mt-1 uppercase tracking-widest">Free Cancellation</p>
          </div>
          
          <button 
            onClick={onBook}
            className="w-full bg-primary text-white font-black py-3 rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-primary-dark transition-all transform active:scale-95">
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
