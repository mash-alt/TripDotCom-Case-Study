import { useState, useEffect } from 'react';
import { Search, User, Menu, Globe, HelpCircle, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  // Simulate authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Also listen to storage events to update navbar state across tabs if needed
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setShowDropdown(false);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled || !isHome ? "bg-white shadow-md py-3" : "bg-transparent text-white"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
            <Globe className="text-white w-6 h-6" />
          </div>
          <span className={cn(
            "text-2xl font-bold tracking-tight",
            isScrolled || !isHome ? "text-gray-900" : "text-white"
          )}>
            Trip<span className="text-primary font-extrabold italic">Stay</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={cn("nav-link", !isScrolled && isHome && "text-white/90 hover:text-white")}>Hotels</Link>
          <Link to="/deals" className={cn("nav-link", !isScrolled && isHome && "text-white/90 hover:text-white")}>Deals</Link>
          <Link to="/support" className={cn("nav-link", !isScrolled && isHome && "text-white/90 hover:text-white")}>Support</Link>
          
          <div className="h-6 w-px bg-gray-200 mx-2 hidden lg:block"></div>
          
          <div className="flex items-center gap-4 relative">
            <button className={cn(
              "p-2 rounded-full hover:bg-gray-100 transition-colors",
              !isScrolled && isHome && "hover:bg-white/10"
            )}>
              <Globe className="w-5 h-5" />
            </button>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={cn(
                    "flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-2xl hover:bg-gray-50 transition-colors",
                    !isScrolled && isHome && "border-white/30 hover:bg-white/10"
                  )}
                >
                  <div className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold">
                    JD
                  </div>
                  <div className="flex flex-col items-start pr-1">
                     <span className={cn("text-xs font-bold leading-tight", !isScrolled && isHome ? "text-white" : "text-gray-900")}>John Doe</span>
                     <span className={cn("text-[10px] font-medium leading-tight", !isScrolled && isHome ? "text-white/70" : "text-gray-500")}>Member</span>
                  </div>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden py-2"
                    >
                      <button className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                        My Bookings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                        Account Settings
                      </button>
                      <div className="h-px bg-gray-100 my-2"></div>
                      <button 
                        onClick={handleSignOut}
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
                "flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-colors",
                !isScrolled && isHome && "border-white/30 hover:bg-white/10"
              )}>
                <User className="w-5 h-5" />
                <span className="font-semibold">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden p-2 rounded-xl border border-gray-200">
          <Menu className={cn("w-6 h-6", !isScrolled && isHome && "text-white")} />
        </button>
      </div>
    </nav>
  );
}
