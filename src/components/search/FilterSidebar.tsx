interface FilterSidebarProps {
  maxPrice: number;
  stars: number;
  onMaxPriceChange: (value: number) => void;
  onStarsChange: (value: number) => void;
  onClear: () => void;
}

export default function FilterSidebar({ maxPrice, stars, onMaxPriceChange, onStarsChange, onClear }: FilterSidebarProps) {
  const starOptions = [5, 4, 3, 2];

  return (
    <aside className="hidden lg:block w-72 shrink-0 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900">Filters</h3>
          <button onClick={onClear} className="text-primary text-sm font-semibold hover:underline">Clear all</button>
        </div>

        <div className="mb-8">
          <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight uppercase">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>₱0</span>
              <span>₱50,000+</span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={500}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Min</span>
                <span className="font-semibold">₱0</span>
              </div>
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Max</span>
                <span className="font-semibold">₱{maxPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 last:mb-0">
          <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight uppercase">Hotel Class</h4>
          <div className="space-y-3">
            {starOptions.map((value) => (
              <label key={value} className="flex items-center group cursor-pointer">
                <input type="radio" checked={stars === value} onChange={() => onStarsChange(value)} className="mr-3 accent-primary" />
                <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">{value} Stars & Up</span>
              </label>
            ))}
            <label className="flex items-center group cursor-pointer">
              <input type="radio" checked={stars === 0} onChange={() => onStarsChange(0)} className="mr-3 accent-primary" />
              <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">All Ratings</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white overflow-hidden relative">
        <h4 className="font-bold mb-2 relative z-10">Trip.com Rewards</h4>
        <p className="text-xs text-gray-400 mb-4 relative z-10 transition-colors">Book directly and earn points you can redeem on your next hotel stay.</p>
        <button className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-lg relative z-10">Learn More</button>
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
      </div>
    </aside>
  );
}
