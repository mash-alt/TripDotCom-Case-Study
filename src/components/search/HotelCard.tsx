import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Hotel } from '@/data/hotels';
import { cn } from '@/lib/utils';

interface HotelCardProps {
  hotel: Hotel;
  horizontal?: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, horizontal = false }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={cn(
        "bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100",
        horizontal ? "flex flex-col md:flex-row h-full" : "flex flex-col"
      )}
    >
      <Link to={`/hotel/${hotel.id}`} className={cn("relative overflow-hidden", horizontal ? "md:w-1/3 aspect-[4/3] md:aspect-auto" : "aspect-[16/10]")}>
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-sm font-bold">{hotel.stars}</span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-50 text-primary text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md">Top Rated</span>
            <div className="flex items-center gap-1">
              {[...Array(hotel.stars)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-accent fill-accent" />
              ))}
            </div>
          </div>
          
          <Link to={`/hotel/${hotel.id}`} className="block">
            <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-primary transition-colors line-clamp-1">{hotel.name}</h3>
          </Link>
          
          <div className="flex items-center gap-1 text-gray-500 mb-3 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{hotel.location}</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary text-white font-bold text-sm px-2 py-0.5 rounded-lg">
              {hotel.rating}
            </div>
            <span className="text-gray-900 font-bold text-sm">Excellent</span>
            <span className="text-gray-400 text-xs">({hotel.reviewsCount} reviews)</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div>
            <span className="text-xs text-gray-400 block">From per night</span>
            <span className="text-2xl font-black text-gray-900">${hotel.price}</span>
          </div>
          <Link to={`/hotel/${hotel.id}`}>
            <button className="bg-gray-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary transition-colors">
              View Stay
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
