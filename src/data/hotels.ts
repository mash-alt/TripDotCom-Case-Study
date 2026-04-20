export interface Room {
  id: string;
  name: string;
  price: number;
  type: string;
  beds: string;
  occupancy: number;
  size: string;
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviewsCount: number;
  price: number;
  image: string;
  description: string;
  amenities: string[];
  stars: number;
  images: string[];
  rooms: Room[];
}

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "The Grand Waterfront Oasis",
    location: "Marina Bay, Singapore",
    city: "Singapore",
    rating: 4.8,
    reviewsCount: 1250,
    price: 350,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    description: "Experience luxury at its finest with breathtaking views of the Marina Bay skyline. Our hotel offers world-class amenities including a rooftop infinity pool, multiple award-winning restaurants, and a state-of-the-art spa.",
    amenities: ["Free WiFi", "Swimming Pool", "Spa", "Gym", "Breakfast Included", "Bar"],
    stars: 5,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
    ],
    rooms: [
      { id: "r1", name: "Deluxe King Room", price: 350, type: "King", beds: "1 King Bed", occupancy: 2, size: "45m²", amenities: ["Minibar", "City View", "Bathrobe"] },
      { id: "r2", name: "Premium Waterfront Suite", price: 550, type: "Suite", beds: "1 King Bed", occupancy: 3, size: "75m²", amenities: ["Living Area", "Marina View", "Club Access"] }
    ]
  },
  {
    id: "2",
    name: "Tokyo Skyscraper View Hotel",
    location: "Shinjuku, Tokyo",
    city: "Tokyo",
    rating: 4.6,
    reviewsCount: 890,
    price: 280,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
    description: "Located in the heart of Shinjuku, this hotel offers minimalist modern rooms with floor-to-ceiling windows overlooking Mount Fuji and the Tokyo skyline.",
    amenities: ["Free WiFi", "Restaurant", "Metro Connection", "Concierge"],
    stars: 4,
    images: [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800"
    ],
    rooms: [
      { id: "r3", name: "Standard Queen", price: 280, type: "Queen", beds: "1 Queen Bed", occupancy: 2, size: "30m²", amenities: ["Smart TV", "Bathtub"] }
    ]
  },
  {
    id: "3",
    name: "Paris Eiffel Elegance",
    location: "7th Arr., Paris",
    city: "Paris",
    rating: 4.9,
    reviewsCount: 2100,
    price: 420,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
    description: "Waking up to the view of the Eiffel Tower is a dream come true at this boutique Parisian hotel. Elegant interiors and impeccable service await.",
    amenities: ["Free WiFi", "Boutique Cafe", "Room Service", "Laundry"],
    stars: 5,
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551882547-ff43c33f7839?auto=format&fit=crop&q=80&w=800"
    ],
    rooms: [
      { id: "r4", name: "Classic French Double", price: 420, type: "Double", beds: "1 King Bed", occupancy: 2, size: "35m²", amenities: ["Balcony", "Eiffel Tower View"] }
    ]
  },
  {
    id: "4",
    name: "Bali Jungle Retreat",
    location: "Ubud, Bali",
    city: "Bali",
    rating: 4.7,
    reviewsCount: 1560,
    price: 180,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
    description: "Immerse yourself in nature at this tranquil jungle resort. Private villas with plunge pools and organic dining experiences.",
    amenities: ["Swimming Pool", "Spa", "Yoga Studio", "Private Pool"],
    stars: 4,
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800"
    ],
    rooms: [
      { id: "r5", name: "Jungle Villa", price: 180, type: "Villa", beds: "1 King Bed", occupancy: 2, size: "60m²", amenities: ["Outdoor Shower", "Private Terrace"] }
    ]
  }
];

export const destinations = [
  { name: "Singapore", image: "https://images.unsplash.com/photo-1525625239566-17b60098dfba?auto=format&fit=crop&q=80&w=800", count: 120 },
  { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-e94e270b2d42?auto=format&fit=crop&q=80&w=800", count: 245 },
  { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800", count: 310 },
  { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800", count: 185 },
  { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800", count: 420 },
  { name: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800", count: 280 }
];
