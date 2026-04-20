import { SlidersHorizontal as Slider } from 'lucide-react';

export default function FilterSidebar() {
  const categories = [
    { name: 'Hotel Class', options: ['5 Stars', '4 Stars', '3 Stars', '2 Stars'] },
    { name: 'Amenities', options: ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Breakfast Included', 'Pet Friendly'] },
    { name: 'Neighborhood', options: ['Downtown', 'Beachfront', 'Near Airport', 'Cultural District'] },
  ];

  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900">Filters</h3>
          <button className="text-primary text-sm font-semibold hover:underline">Clear all</button>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight uppercase">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>$0</span>
              <span>$1000+</span>
            </div>
            <input type="range" className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" />
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Min</span>
                <span className="font-semibold">$0</span>
              </div>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Max</span>
                <span className="font-semibold">$1000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categorized Filters */}
        {categories.map((cat) => (
          <div key={cat.name} className="mb-8 last:mb-0">
            <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight uppercase">{cat.name}</h4>
            <div className="space-y-3">
              {cat.options.map((opt) => (
                <label key={opt} className="flex items-center group cursor-pointer">
                  <div className="w-5 h-5 border-2 border-gray-200 rounded-md mr-3 flex items-center justify-center group-hover:border-primary transition-colors">
                    <div className="w-2.5 h-2.5 bg-primary rounded-sm opacity-0 group-has-[:checked]:opacity-100 transition-opacity" />
                  </div>
                  <input type="checkbox" className="hidden peer" />
                  <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 peer-checked:text-primary transition-colors">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ads/Promotion in Sidebar */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white overflow-hidden relative">
        <h4 className="font-bold mb-2 relative z-10">TripStay App</h4>
        <p className="text-xs text-gray-400 mb-4 relative z-10 transition-colors">Download now and get extra 15% off your first mobile booking.</p>
        <button className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-lg relative z-10">Get App</button>
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
      </div>
    </aside>
  );
}
