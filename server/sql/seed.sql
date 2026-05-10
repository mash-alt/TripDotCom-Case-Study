-- ============================================================
-- TripStay Seed Data
-- Run AFTER schema.sql to populate with test data
-- All passwords are hashed from: "Password123!"
-- ============================================================

USE tripdotcom;

-- ============================================================
-- ADMINS (Hotel Owners)
-- Password for all: Password123!
-- ============================================================
INSERT INTO admins (full_name, email, password_hash) VALUES
('Maria Santos',    'maria@tripstay.com',    '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('James Rodriguez', 'james@tripstay.com',    '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Li Wei Chen',     'liwei@tripstay.com',    '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Sophie Laurent',  'sophie@tripstay.com',   '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Kenji Tanaka',    'kenji@tripstay.com',    '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS');

-- ============================================================
-- CUSTOMERS (Regular Users)
-- Password for all: Password123!
-- ============================================================
INSERT INTO customers (full_name, email, phone_number, password_hash) VALUES
('John Doe',          'john@gmail.com',       '+63 917 123 4567',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Jane Smith',        'jane@gmail.com',       '+63 918 234 5678',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Mike Johnson',      'mike@gmail.com',       '+63 919 345 6789',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Emily Davis',       'emily@gmail.com',      '+63 920 456 7890',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Carlos Rivera',     'carlos@gmail.com',     '+63 921 567 8901',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Anna Lee',          'anna@gmail.com',       '+63 922 678 9012',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('David Kim',         'david@gmail.com',      '+63 923 789 0123',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Sarah Wilson',      'sarah@gmail.com',      '+63 924 890 1234',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Roberto Cruz',      'roberto@gmail.com',    '+63 925 901 2345',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'),
('Mei Ling Tan',      'meiling@gmail.com',    '+63 926 012 3456',  '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS');

-- ============================================================
-- LOYALTY entries for each customer
-- ============================================================
INSERT INTO loyalty (customer_id, points, membership_level) VALUES
(1,  1200, 'Silver'),
(2,  3500, 'Gold'),
(3,   250, 'Bronze'),
(4,  8000, 'Platinum'),
(5,   500, 'Bronze'),
(6,  1800, 'Silver'),
(7,  5200, 'Gold'),
(8,   100, 'Bronze'),
(9,  2800, 'Silver'),
(10, 6500, 'Gold');

-- ============================================================
-- HOTELS
-- ============================================================
INSERT INTO hotels (admin_id, name, city, country, address, description, star_rating, review_score, reviews_count) VALUES
-- Maria's hotels
(2, 'The Grand Manila',       'Manila',     'Philippines', '123 Roxas Blvd, Ermita, Manila',
 'A luxurious 5-star hotel in the heart of Manila offering stunning bay views, world-class dining, and impeccable service. Features an infinity pool, full-service spa, and exclusive rooftop lounge.',
 5, 4.80, 342),

(2, 'Boracay Sunset Resort',  'Boracay',    'Philippines', 'Station 1, Boracay Island, Malay, Aklan',
 'A beachfront paradise on the famous White Beach. Wake up to crystal-clear turquoise waters and powdery white sand. Perfect for couples and families seeking a tropical escape.',
 4, 4.65, 218),

-- James's hotels
(3, 'Cebu Ocean Park Hotel',  'Cebu',       'Philippines', '456 Mactan Newtown, Lapu-Lapu City, Cebu',
 'Modern oceanfront hotel steps away from Cebu Ocean Park. Features contemporary rooms with ocean views, multiple restaurants, and direct beach access. Ideal base for island-hopping adventures.',
 4, 4.50, 156),

(3, 'Palawan Eco Lodge',      'Puerto Princesa', 'Philippines', '789 Honda Bay Road, Puerto Princesa, Palawan',
 'An eco-friendly lodge surrounded by lush tropical forest and pristine beaches. Experience sustainable luxury with nature tours, kayaking, and underground river excursions included.',
 3, 4.70, 89),

-- Li Wei's hotels
(4, 'Skyline Suites BGC',     'Taguig',     'Philippines', '321 High Street South, BGC, Taguig',
 'Ultra-modern serviced suites in the vibrant Bonifacio Global City. Floor-to-ceiling windows offer breathtaking city skylines. Walking distance to upscale shopping, dining, and nightlife.',
 5, 4.85, 275),

(4, 'Baguio Pines Hotel',     'Baguio',     'Philippines', '654 Session Road, Baguio City',
 'A charming mountain retreat in the cool City of Pines. Heritage architecture meets modern comfort. Features cozy fireplaces, a garden café, and panoramic views of the Cordillera mountains.',
 3, 4.40, 198),

-- Sophie's hotels
(5, 'Siargao Surf House',     'Siargao',    'Philippines', '101 Cloud 9, General Luna, Siargao Island',
 'A laid-back surfer\'s paradise steps from the legendary Cloud 9 break. Offers surf lessons, board rentals, and a vibrant social scene. The perfect blend of adventure and island relaxation.',
 3, 4.55, 134),

-- Kenji's hotels
(6, 'Makati Business Hotel',  'Makati',     'Philippines', '888 Ayala Avenue, Makati City',
 'A sleek business hotel in Makati\'s financial district. Features state-of-the-art meeting rooms, high-speed WiFi, executive lounge, and easy access to Greenbelt and Glorietta malls.',
 4, 4.35, 310),

(6, 'Tagaytay Ridge Inn',     'Tagaytay',   'Philippines', '222 Aguinaldo Highway, Tagaytay City',
 'A boutique inn perched on the Tagaytay ridge with mesmerizing views of Taal Volcano and lake. Features an acclaimed restaurant, infinity pool, and lush tropical gardens.',
 4, 4.60, 167);

-- ============================================================
-- HOTEL IMAGES
-- ============================================================
INSERT INTO hotel_images (hotel_id, image_url, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 1),
(1, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 2),
(2, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', 1),
(2, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 2),
(3, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', 1),
(3, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 2),
(4, 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800', 1),
(5, 'https://images.unsplash.com/photo-1606046604972-77cc76aee944?w=800', 1),
(5, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', 2),
(6, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', 1),
(7, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 1),
(8, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', 1),
(8, 'https://images.unsplash.com/photo-1590490360182-c33d955e4c47?w=800', 2),
(9, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 1);

-- ============================================================
-- HOTEL AMENITIES
-- ============================================================
INSERT INTO hotel_amenities (hotel_id, amenity_name) VALUES
(1, 'Free WiFi'), (1, 'Swimming Pool'), (1, 'Spa'), (1, 'Fitness Center'), (1, 'Restaurant'), (1, 'Room Service'), (1, 'Concierge'), (1, 'Valet Parking'),
(2, 'Free WiFi'), (2, 'Beachfront'), (2, 'Swimming Pool'), (2, 'Water Sports'), (2, 'Restaurant'), (2, 'Bar'),
(3, 'Free WiFi'), (3, 'Swimming Pool'), (3, 'Beach Access'), (3, 'Restaurant'), (3, 'Kids Club'), (3, 'Diving Center'),
(4, 'Free WiFi'), (4, 'Nature Tours'), (4, 'Kayaking'), (4, 'Restaurant'), (4, 'Eco Tours'),
(5, 'Free WiFi'), (5, 'Swimming Pool'), (5, 'Fitness Center'), (5, 'Business Center'), (5, 'Restaurant'), (5, 'Rooftop Bar'), (5, 'Concierge'),
(6, 'Free WiFi'), (6, 'Garden'), (6, 'Fireplace'), (6, 'Café'), (6, 'Parking'),
(7, 'Free WiFi'), (7, 'Surf Lessons'), (7, 'Board Rental'), (7, 'Bar'), (7, 'Hammock Lounge'),
(8, 'Free WiFi'), (8, 'Business Center'), (8, 'Fitness Center'), (8, 'Restaurant'), (8, 'Meeting Rooms'), (8, 'Executive Lounge'), (8, 'Laundry Service'),
(9, 'Free WiFi'), (9, 'Swimming Pool'), (9, 'Restaurant'), (9, 'Garden'), (9, 'Parking'), (9, 'Scenic Views');

-- ============================================================
-- ROOMS
-- ============================================================
INSERT INTO rooms (hotel_id, name, room_type, description, bed_type, size_sqm, capacity_adults, capacity_children, price_per_night, total_inventory, image_url) VALUES
-- The Grand Manila (hotel 1)
(1, 'Deluxe Bay View',        'Deluxe',     'Elegant room with panoramic Manila Bay views, marble bathroom, and premium amenities.',                 'King',   45.00, 2, 1, 8500.00,  10, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'),
(1, 'Premier Suite',          'Suite',      'Spacious suite with separate living area, bay view, butler service, and exclusive lounge access.',      'King',   80.00, 2, 2, 15000.00,  5, 'https://images.unsplash.com/photo-1590490360182-c33d955e4c47?w=600'),
(1, 'Standard City View',     'Standard',   'Comfortable room with city views, work desk, and all essential amenities for a pleasant stay.',         'Queen',  32.00, 2, 1, 5500.00,  15, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600'),

-- Boracay Sunset Resort (hotel 2)
(2, 'Beachfront Villa',       'Villa',      'Private beachfront villa with direct white beach access, outdoor shower, and sunset terrace.',          'King',   65.00, 2, 2, 12000.00,  4, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600'),
(2, 'Garden Room',            'Standard',   'Cozy room surrounded by tropical gardens, steps away from the beach.',                                 'Double', 28.00, 2, 1, 4500.00,  12, 'https://images.unsplash.com/photo-1598928506311-c55ez637a590?w=600'),

-- Cebu Ocean Park Hotel (hotel 3)
(3, 'Ocean View Deluxe',      'Deluxe',     'Modern room with floor-to-ceiling ocean views and private balcony.',                                    'King',   40.00, 2, 1, 6500.00,   8, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600'),
(3, 'Family Suite',           'Suite',      'Spacious family suite with connecting rooms, kids play area, and ocean views.',                         'Twin',   72.00, 4, 3, 11000.00,  3, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600'),

-- Palawan Eco Lodge (hotel 4)
(4, 'Eco Cabin',              'Standard',   'Sustainable bamboo cabin nestled in tropical forest with nature views.',                                'Queen',  25.00, 2, 0, 3500.00,   6, 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600'),
(4, 'Treehouse Room',         'Deluxe',     'Elevated treehouse room offering a unique stay among the canopy with stunning sunrise views.',          'Double', 30.00, 2, 1, 5000.00,   3, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600'),

-- Skyline Suites BGC (hotel 5)
(5, 'Executive Studio',       'Studio',     'Sleek studio with kitchenette, high-speed WiFi, and stunning BGC skyline views.',                      'Queen',  38.00, 2, 0, 7000.00,  12, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'),
(5, 'Penthouse Suite',        'Penthouse',  'Top-floor penthouse with wraparound terrace, private jacuzzi, and 360-degree city views.',             'King',  120.00, 2, 2, 25000.00,  2, 'https://images.unsplash.com/photo-1590490360182-c33d955e4c47?w=600'),

-- Baguio Pines Hotel (hotel 6)
(6, 'Pine View Room',         'Standard',   'Warm and cozy room with pine forest views and a fireplace.',                                           'Queen',  30.00, 2, 1, 3000.00,  10, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600'),
(6, 'Mountain Suite',         'Suite',      'Spacious suite with panoramic mountain views, living area, and private terrace.',                      'King',   55.00, 2, 2, 5500.00,   4, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600'),

-- Siargao Surf House (hotel 7)
(7, 'Surfer Bunk',            'Dormitory',  'Fun shared room with individual bunk beds, surf rack storage, and social common area.',                'Single', 18.00, 1, 0, 1200.00,  8,  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'),
(7, 'Private Surf Cabin',     'Standard',   'Private cabin with surf-themed décor, outdoor hammock, and garden views.',                             'Double', 24.00, 2, 0, 2800.00,  5,  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600'),

-- Makati Business Hotel (hotel 8)
(8, 'Business Standard',      'Standard',   'Efficient room with ergonomic work desk, fast WiFi, and city views. Perfect for business travelers.',  'Queen',  30.00, 2, 0, 4800.00,  20, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600'),
(8, 'Executive Suite',        'Suite',      'Premium suite with separate office space, meeting table, espresso machine, and executive lounge access.','King',  60.00, 2, 1, 9500.00,   6, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600'),

-- Tagaytay Ridge Inn (hotel 9)
(9, 'Ridge View Room',        'Standard',   'Charming room with stunning Taal Volcano views and a cozy reading nook.',                              'Queen',  28.00, 2, 1, 3800.00,   8, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600'),
(9, 'Volcano Suite',          'Suite',      'Luxurious suite with private balcony overlooking Taal Lake, jacuzzi tub, and premium minibar.',        'King',   50.00, 2, 2, 7500.00,   3, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600');

-- ============================================================
-- ROOM AMENITIES
-- ============================================================
INSERT INTO room_amenities (room_id, amenity_name) VALUES
(1, 'Air Conditioning'), (1, 'Mini Bar'), (1, 'Safe'), (1, 'Bathrobe'), (1, 'Coffee Machine'),
(2, 'Air Conditioning'), (2, 'Mini Bar'), (2, 'Safe'), (2, 'Bathrobe'), (2, 'Butler Service'), (2, 'Lounge Access'),
(3, 'Air Conditioning'), (3, 'Mini Bar'), (3, 'Safe'), (3, 'Work Desk'),
(4, 'Air Conditioning'), (4, 'Mini Bar'), (4, 'Private Beach'), (4, 'Outdoor Shower'),
(5, 'Air Conditioning'), (5, 'Fan'), (5, 'Garden View'),
(6, 'Air Conditioning'), (6, 'Mini Bar'), (6, 'Balcony'), (6, 'Safe'),
(7, 'Air Conditioning'), (7, 'Mini Bar'), (7, 'Kids Play Area'), (7, 'Connecting Rooms'),
(8, 'Fan'), (8, 'Mosquito Net'), (8, 'Nature View'),
(9, 'Fan'), (9, 'Mosquito Net'), (9, 'Canopy View'), (9, 'Sunrise Terrace'),
(10, 'Air Conditioning'), (10, 'Kitchenette'), (10, 'Work Desk'), (10, 'Smart TV'),
(11, 'Air Conditioning'), (11, 'Jacuzzi'), (11, 'Terrace'), (11, 'Premium Minibar'), (11, 'Smart TV'),
(12, 'Fireplace'), (12, 'Heater'), (12, 'Hot Chocolate Station'),
(13, 'Fireplace'), (13, 'Heater'), (13, 'Living Area'), (13, 'Private Terrace'),
(14, 'Fan'), (14, 'Surf Rack'), (14, 'Shared Bathroom'),
(15, 'Fan'), (15, 'Hammock'), (15, 'Garden View'), (15, 'Private Bathroom'),
(16, 'Air Conditioning'), (16, 'Work Desk'), (16, 'Fast WiFi'), (16, 'Coffee Machine'),
(17, 'Air Conditioning'), (17, 'Office Space'), (17, 'Espresso Machine'), (17, 'Lounge Access'), (17, 'Meeting Table'),
(18, 'Air Conditioning'), (18, 'Reading Nook'), (18, 'Volcano View'),
(19, 'Air Conditioning'), (19, 'Jacuzzi'), (19, 'Balcony'), (19, 'Premium Minibar'), (19, 'Volcano View');

-- ============================================================
-- BOOKINGS (mix of statuses)
-- ============================================================
INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, nights, total_price, booking_status) VALUES
(1, 1,  '2026-05-15', '2026-05-18', 3, 25500.00, 'Confirmed'),
(1, 10, '2026-06-01', '2026-06-04', 3, 21000.00, 'PendingPayment'),
(2, 4,  '2026-05-20', '2026-05-25', 5, 60000.00, 'Confirmed'),
(3, 6,  '2026-05-10', '2026-05-12', 2, 13000.00, 'Completed'),
(4, 2,  '2026-06-10', '2026-06-14', 4, 60000.00, 'Confirmed'),
(5, 15, '2026-05-22', '2026-05-25', 3,  8400.00, 'Confirmed'),
(6, 12, '2026-05-18', '2026-05-20', 2,  6000.00, 'Cancelled'),
(7, 16, '2026-05-25', '2026-05-28', 3, 14400.00, 'Confirmed'),
(8, 8,  '2026-06-05', '2026-06-08', 3, 10500.00, 'PendingPayment'),
(9, 18, '2026-05-12', '2026-05-14', 2,  7600.00, 'Completed'),
(10, 11, '2026-06-20', '2026-06-23', 3, 75000.00, 'Confirmed'),
(2, 19, '2026-05-30', '2026-06-02', 3, 22500.00, 'Confirmed'),
(4, 14, '2026-05-15', '2026-05-18', 3,  3600.00, 'Completed');

-- ============================================================
-- PAYMENTS
-- ============================================================
INSERT INTO payments (booking_id, amount, payment_status, payment_method, transaction_reference, paid_at) VALUES
(1,  25500.00, 'Paid',     'Credit Card',  'TXN-2026-001', '2026-05-14 10:30:00'),
(3,  60000.00, 'Paid',     'Credit Card',  'TXN-2026-003', '2026-05-19 14:00:00'),
(4,  13000.00, 'Paid',     'GCash',        'TXN-2026-004', '2026-05-09 09:15:00'),
(5,  60000.00, 'Paid',     'Credit Card',  'TXN-2026-005', '2026-06-09 16:45:00'),
(6,   8400.00, 'Paid',     'PayMaya',      'TXN-2026-006', '2026-05-21 11:20:00'),
(7,   6000.00, 'Refunded', 'Credit Card',  'TXN-2026-007', '2026-05-17 08:00:00'),
(8,  14400.00, 'Paid',     'Bank Transfer', 'TXN-2026-008', '2026-05-24 13:30:00'),
(10,  7600.00, 'Paid',     'GCash',        'TXN-2026-010', '2026-05-11 17:00:00'),
(11, 75000.00, 'Paid',     'Credit Card',  'TXN-2026-011', '2026-06-19 10:00:00'),
(12, 22500.00, 'Paid',     'Credit Card',  'TXN-2026-012', '2026-05-29 15:30:00'),
(13,  3600.00, 'Paid',     'GCash',        'TXN-2026-013', '2026-05-14 12:00:00');

-- ============================================================
-- REFUNDS
-- ============================================================
INSERT INTO refunds (booking_id, amount, refund_status, reason, requested_at, processed_at) VALUES
(7, 6000.00, 'Processed', 'Change of travel plans due to weather advisory.', '2026-05-18 09:00:00', '2026-05-19 14:30:00');

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
INSERT INTO support_tickets (customer_id, booking_id, admin_id, subject, message, ticket_status, resolution_notes) VALUES
(1, 1,  NULL, 'Room upgrade request',         'Hi, I was wondering if it is possible to upgrade my Deluxe Bay View room to the Premier Suite for my stay on May 15-18? Thank you!', 'Open', NULL),
(3, 4,  1,    'Early check-in request',       'Can I check in at 10 AM instead of the standard 2 PM? My flight arrives early morning.', 'Resolved', 'Approved early check-in at 10 AM. Room was ready.'),
(6, 7,  1,    'Refund status inquiry',         'I cancelled my booking due to a weather advisory. When will my refund be processed?', 'Resolved', 'Refund has been processed to original payment method. Please allow 3-5 business days.'),
(9, 10, NULL, 'Missing amenities in room',     'The room was great but the minibar was not restocked and the reading lamp was not working.', 'Open', NULL);

SELECT '✅ Seed data inserted successfully!' AS status;
