import { useEffect, useState } from 'react';
import { User, Menu, Globe, LogOut, ShieldCheck, LifeBuoy, Hotel, Award } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled || !isHome ? 'bg-white shadow-md py-3' : 'bg-transparent text-white',
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
            <Globe className="text-white w-6 h-6" />
          </div>
          <span className={cn('text-2xl font-bold tracking-tight', isScrolled || !isHome ? 'text-gray-900' : 'text-white')}>
            Trip<span className="text-primary font-extrabold italic">Stay</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={cn('nav-link', !isScrolled && isHome && 'text-white/90 hover:text-white')}>Hotels</Link>
          {user?.role === 'customer' && (
            <Link to="/bookings" className={cn('nav-link', !isScrolled && isHome && 'text-white/90 hover:text-white')}>My Bookings</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className={cn('nav-link', !isScrolled && isHome && 'text-white/90 hover:text-white')}>Admin</Link>
          )}
          <Link to="/support" className={cn('nav-link', !isScrolled && isHome && 'text-white/90 hover:text-white')}>Support</Link>
          {(!isAuthenticated || user?.role === 'customer') && (
            <Link to="/loyalty" className={cn('nav-link font-bold text-primary', !isScrolled && isHome && 'text-white/90 hover:text-white')}>Rewards</Link>
          )}

          <div className="h-6 w-px bg-gray-200 mx-2 hidden lg:block"></div>

          <div className="flex items-center gap-4 relative">
            <button className={cn('p-2 rounded-full hover:bg-gray-100 transition-colors', !isScrolled && isHome && 'hover:bg-white/10')}>
              <Globe className="w-5 h-5" />
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((open) => !open)}
                  className={cn(
                    'flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-2xl hover:bg-gray-50 transition-colors',
                    !isScrolled && isHome && 'border-white/30 hover:bg-white/10',
                  )}
                >
                  <div className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold">
                    {user.fullName.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start pr-1">
                    <span className={cn('text-xs font-bold leading-tight', !isScrolled && isHome ? 'text-white' : 'text-gray-900')}>
                      {user.fullName}
                    </span>
                    <span className={cn('text-[10px] font-medium leading-tight', !isScrolled && isHome ? 'text-white/70' : 'text-gray-500')}>
                      {user.role === 'admin' ? 'Admin' : user.membershipLevel ?? 'Member'}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-2"
                    >
                      {user.role === 'customer' && (
                        <Link to="/bookings" onClick={() => setShowDropdown(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                          <Hotel className="w-4 h-4" />
                          My Bookings
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setShowDropdown(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                          <ShieldCheck className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link to="/support" onClick={() => setShowDropdown(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                        <LifeBuoy className="w-4 h-4" />
                        Support
                      </Link>
                      {user.role === 'customer' && (
                        <Link to="/loyalty" onClick={() => setShowDropdown(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                          <Award className="w-4 h-4" />
                          Rewards
                        </Link>
                      )}
                      <div className="h-px bg-gray-100 my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className={cn(
                  'flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-colors',
                  !isScrolled && isHome && 'border-white/30 hover:bg-white/10',
                )}
              >
                <User className="w-5 h-5" />
                <span className="font-semibold">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        <button className="md:hidden p-2 rounded-xl border border-gray-200">
          <Menu className={cn('w-6 h-6', !isScrolled && isHome && 'text-white')} />
        </button>
      </div>
    </nav>
  );
}
