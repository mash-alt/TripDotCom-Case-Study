import { Globe, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Globe className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Trip<span className="text-primary font-extrabold italic">.com</span></span>
            </Link>
            <p className="text-gray-400 leading-relaxed font-medium">
              Discover your next adventure with Trip.com. We provide seamless hotel bookings and exceptional travel experiences worldwide since 2024.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h3>
            <ul className="space-y-4 font-medium">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/popular" className="hover:text-primary transition-colors">Popular Hotels</Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors">Find a Stay</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Support</h3>
            <ul className="space-y-4 font-medium">
              <li><Link to="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Contact Us</h3>
            <ul className="space-y-4 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>123 Global Avenue, Metro Manila, Philippines</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+63 2 8123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>support@trip.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-gray-500">
            © {currentYear} Trip.com. All rights reserved. Built with Vite, React & MySQL.
          </p>
          <div className="flex items-center gap-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
