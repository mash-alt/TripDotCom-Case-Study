import { useState, useEffect } from 'react';
import { Search, User, Menu, Globe, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

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
          
          <div className="flex items-center gap-4">
            <button className={cn(
              "p-2 rounded-full hover:bg-gray-100 transition-colors",
              !isScrolled && isHome && "hover:bg-white/10"
            )}>
              <Globe className="w-5 h-5" />
            </button>
            <button className={cn(
              "flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-colors",
              !isScrolled && isHome && "border-white/30 hover:bg-white/10"
            )}>
              <User className="w-5 h-5" />
              <span className="font-semibold">Sign In</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden p-2 rounded-xl border border-gray-200">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
