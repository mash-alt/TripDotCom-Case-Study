import Hero from '@/components/home/Hero';
import SearchBar from '@/components/home/SearchBar';
import FeaturedSection from '@/components/home/FeaturedSection';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <SearchBar />
        <FeaturedSection />
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="max-w-xs">
            <h2 className="text-xl font-bold mb-4">Trip<span className="text-primary italic">Stay</span></h2>
            <p className="text-gray-500 text-sm">Simplifying your travel planning with curated stays and exclusive deals worldwide. Your journey starts here.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 flex-1">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                <li className="hover:text-primary cursor-pointer">Help Center</li>
                <li className="hover:text-primary cursor-pointer">Refund Policy</li>
                <li className="hover:text-primary cursor-pointer">COVID-19 FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                <li className="hover:text-primary cursor-pointer">Our Story</li>
                <li className="hover:text-primary cursor-pointer">Careers</li>
                <li className="hover:text-primary cursor-pointer">Investor Relations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-medium">
                <li className="hover:text-primary cursor-pointer">Privacy</li>
                <li className="hover:text-primary cursor-pointer">Terms of Use</li>
                <li className="hover:text-primary cursor-pointer">Cookies</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-widest">
          <span>© 2026 TripStay Technologies. All rights reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer">Twitter</span>
            <span className="hover:text-primary cursor-pointer">Instagram</span>
            <span className="hover:text-primary cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
