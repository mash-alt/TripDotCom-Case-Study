import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'motion/react';
import { ShieldCheck, Star, Zap, Award, Gift, Gem, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loyaltyApi } from '@/api/services';
import type { LoyaltySummary } from '@/types/api';
import { Link } from 'react-router-dom';

const TIERS = [
  {
    name: 'Silver',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: Award,
    requirement: '0+ Points',
    bonus: 'Base Rate',
    features: ['Standard Rewards', 'Member-only Rates', 'Trip Coins Earning']
  },
  {
    name: 'Gold',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Star,
    requirement: '1,000+ Points',
    bonus: '+20% Points',
    features: ['Priority Support', 'Late Check-out (Subject to availability)', '20% Bonus Trip Coins']
  },
  {
    name: 'Platinum',
    color: 'text-blue-400',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: ShieldCheck,
    requirement: '3,000+ Points',
    bonus: '+50% Points',
    features: ['Room Upgrades', 'Welcome Gift', '50% Bonus Trip Coins']
  },
  {
    name: 'Diamond',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    icon: Gem,
    requirement: '10,000+ Points',
    bonus: '+100% Points',
    features: ['Free Breakfast', 'Guaranteed Availability', '100% Bonus Trip Coins']
  },
  {
    name: 'Black Diamond',
    color: 'text-gray-900',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    icon: Zap,
    requirement: '50,000+ Points',
    bonus: '+200% Points',
    features: ['Personal Concierge', 'Airport Transfers', '200% Bonus Trip Coins', 'Exclusive Lounge Access']
  }
];

export default function LoyaltyPage() {
  const { user, token } = useAuth();
  const [loyalty, setLoyalty] = useState<LoyaltySummary | null>(null);

  useEffect(() => {
    if (user && token) {
      loyaltyApi.get(user.id, token)
        .then(setLoyalty)
        .catch(console.error);
    }
  }, [user, token]);

  const currentTier = loyalty?.membershipLevel ?? 'Silver';
  const tierIndex = TIERS.findIndex(t => t.name === currentTier);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden bg-gray-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-blue-300 text-sm font-bold mb-8"
            >
              <Award className="w-4 h-4" />
              Trip.com Rewards Program
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black mb-6 tracking-tight"
            >
              The More You Explore,<br />
              <span className="text-primary italic">The More You Save</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            >
              Earn Trip Coins on every completed stay and unlock exclusive benefits. 
              Join 10M+ travelers getting more out of every journey.
            </motion.p>

            {!user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link to="/register" className="bg-primary text-white font-bold px-10 py-5 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-blue-500/30 inline-flex items-center gap-2 group">
                  Join for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* Current Status Section */}
        {user && loyalty && (
          <section className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Welcome Back, {user.fullName.split(' ')[0]}</p>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-4xl font-black text-gray-900">{loyalty.membershipLevel}</h2>
                    <div className="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                      Member since {new Date(user.createdAt ?? Date.now()).getFullYear()}
                    </div>
                  </div>
                  <p className="text-gray-500 font-medium">You have <span className="text-primary font-black">{loyalty.points} Trip Coins</span> available.</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="text-center bg-gray-50 rounded-3xl p-6 min-w-[140px] border border-gray-100">
                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Redeemable Value</div>
                    <div className="text-2xl font-black text-gray-900">₱{(loyalty.points / 100 * 50).toLocaleString()}</div>
                  </div>
                  <Link to="/bookings" className="bg-gray-900 text-white rounded-3xl p-6 flex flex-col justify-center min-w-[140px] hover:bg-black transition-colors">
                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 text-center">My Rewards</div>
                    <div className="text-sm font-bold flex items-center justify-center gap-2">View History <ArrowRight className="w-4 h-4" /></div>
                  </Link>
                </div>
              </div>

              {/* Progress Bar */}
              {tierIndex < TIERS.length - 1 && (
                <div className="mt-12">
                  <div className="flex justify-between items-end mb-4">
                    <div className="text-sm font-bold text-gray-900">Next Tier: {TIERS[tierIndex + 1].name}</div>
                    <div className="text-sm font-medium text-gray-500">
                      {parseInt(TIERS[tierIndex + 1].requirement) - loyalty.points} more points to unlock
                    </div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (loyalty.points / parseInt(TIERS[tierIndex + 1].requirement)) * 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-primary rounded-full shadow-lg shadow-blue-500/40"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </section>
        )}

        {/* Membership Tiers Grid */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Membership Tiers</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">Unlock more benefits as you climb the tiers. Every ₱2 spent earns 1 Trip Coin (Base Rate).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {TIERS.map((tier, idx) => {
              const Icon = tier.icon;
              const isCurrent = tier.name === currentTier;
              
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col rounded-[2rem] p-8 border ${
                    isCurrent ? 'border-primary ring-2 ring-primary/20 shadow-xl scale-105 z-10' : 'border-gray-100 bg-white'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                      Current Tier
                    </div>
                  )}
                  
                  <div className={`w-14 h-14 ${tier.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${tier.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-black text-gray-900 mb-1">{tier.name}</h3>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{tier.requirement}</div>
                  
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reward Multiplier</div>
                    <div className="text-lg font-black text-gray-900">{tier.bonus}</div>
                  </div>

                  <div className="space-y-3 flex-1">
                    {tier.features.map(feature => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-gray-600 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 py-24 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Member-only Rates', desc: 'Save up to 20% more on already discounted stays.', icon: Award },
                  { title: 'Earn Everywhere', desc: 'Trip Coins earned on any hotel in our global network.', icon: Zap },
                  { title: 'Easy Redemption', desc: 'Every 100 coins is ₱50 off your next booking.', icon: Gift },
                  { title: 'Tier Multipliers', desc: 'Earn faster as you reach Gold, Platinum, and Diamond.', icon: Star }
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                  >
                    <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">Why Join Trip.com Rewards?</h2>
              <p className="text-lg text-gray-500 font-medium mb-8">We believe every journey should be rewarded. That&apos;s why we created the most transparent and rewarding loyalty program in the industry.</p>
              
              <ul className="space-y-4 mb-10">
                {[
                  'No blackout dates for coin redemption',
                  'Trip Coins never expire as long as you stay active',
                  'Combine coins with existing promo codes',
                  'Instant tier updates after booking completion'
                ].map((point, idx) => (
                  <motion.li
                    key={point}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 text-gray-900 font-bold"
                  >
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {point}
                  </motion.li>
                ))}
              </ul>

              {!user && (
                <Link to="/register" className="text-primary font-black inline-flex items-center gap-2 hover:gap-4 transition-all">
                  Create an account to start earning <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
