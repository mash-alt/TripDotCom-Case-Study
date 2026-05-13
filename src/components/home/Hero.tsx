import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] scale-110 animate-slow-zoom"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-gray-50/100" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
        >
          Discover Your Perfect <br /> 
          <span className="text-primary italic">Stays</span> Worldwide
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-lg md:text-xl text-white/90 font-medium mb-10 max-w-2xl mx-auto"
        >
          Book unique hotels, boutique stays, and luxury resorts at the best prices with Trip.com.
        </motion.p>
      </div>
    </div>
  );
}
