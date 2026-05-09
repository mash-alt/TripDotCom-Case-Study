CREATE DATABASE IF NOT EXISTS tripstay;
USE tripstay;

CREATE TABLE IF NOT EXISTS admins (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone_number VARCHAR(30) NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loyalty (
  loyalty_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL UNIQUE,
  points INT NOT NULL DEFAULT 0,
  membership_level ENUM('Silver', 'Gold', 'Platinum', 'Diamond', 'Diamond+', 'Black Diamond') NOT NULL DEFAULT 'Silver',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_loyalty_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hotels (
  hotel_id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  city VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  address VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  star_rating TINYINT NOT NULL,
  review_score DECIMAL(3, 2) NOT NULL DEFAULT 0,
  reviews_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hotel_admin FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS hotel_images (
  image_id INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  CONSTRAINT fk_hotel_image_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hotel_amenities (
  amenity_id INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT NOT NULL,
  amenity_name VARCHAR(120) NOT NULL,
  CONSTRAINT fk_hotel_amenity_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rooms (
  room_id INT PRIMARY KEY AUTO_INCREMENT,
  hotel_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  room_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  bed_type VARCHAR(100) NOT NULL,
  size_sqm DECIMAL(8, 2) NOT NULL,
  capacity_adults INT NOT NULL,
  capacity_children INT NOT NULL DEFAULT 0,
  price_per_night DECIMAL(10, 2) NOT NULL,
  total_inventory INT NOT NULL DEFAULT 1,
  image_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_room_hotel FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS room_amenities (
  room_amenity_id INT PRIMARY KEY AUTO_INCREMENT,
  room_id INT NOT NULL,
  amenity_name VARCHAR(120) NOT NULL,
  CONSTRAINT fk_room_amenity_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  booking_status ENUM('PendingPayment', 'Confirmed', 'CheckedIn', 'Cancelled', 'Completed') NOT NULL DEFAULT 'PendingPayment',
  coins_redeemed INT NOT NULL DEFAULT 0,
  discount_applied DECIMAL(10, 2) NOT NULL DEFAULT 0,
  cancelled_at TIMESTAMP NULL,
  internal_notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
  CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending',
  payment_method VARCHAR(120) NOT NULL,
  transaction_reference VARCHAR(120) NULL,
  paid_at TIMESTAMP NULL,
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS refunds (
  refund_id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  refund_status ENUM('Requested', 'Approved', 'Rejected', 'Processed') NOT NULL DEFAULT 'Requested',
  reason TEXT NOT NULL,
  requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  CONSTRAINT fk_refund_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS support_tickets (
  support_id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  booking_id INT NULL,
  admin_id INT NULL,
  subject VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  ticket_status ENUM('Open', 'InProgress', 'Resolved') NOT NULL DEFAULT 'Open',
  resolution_notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_support_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
  CONSTRAINT fk_support_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL,
  CONSTRAINT fk_support_admin FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE SET NULL
);

INSERT INTO admins (full_name, email, password_hash)
SELECT 'System Admin', 'admin@tripstay.com', '$2b$10$RnHLQRSj/Cp3CuQh7GStyOytxbhi47DZPJv2nZ9Q8ZQC2F3dR10qS'
WHERE NOT EXISTS (
  SELECT 1 FROM admins WHERE email = 'admin@tripstay.com'
);
