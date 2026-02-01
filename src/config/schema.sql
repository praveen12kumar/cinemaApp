-- ================================
-- MOVIE BOOKING APP DATABASE SCHEMA
-- SQLite Compatible
-- ================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  membership_type TEXT CHECK (membership_type IN ('SILVER', 'GOLD', 'PLATINUM')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- CITIES
CREATE TABLE IF NOT EXISTS cities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  state TEXT NOT NULL
);

-- THEATERS
CREATE TABLE IF NOT EXISTS theaters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city_id INTEGER NOT NULL,
  address TEXT NOT NULL,
  total_screens INTEGER NOT NULL CHECK (total_screens > 0),
  facilities TEXT,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- SCREENS
CREATE TABLE IF NOT EXISTS screens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theater_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  screen_type TEXT CHECK (screen_type IN ('2D', '3D', 'IMAX', '4DX')),
  total_capacity INTEGER NOT NULL CHECK (total_capacity > 0),
  sound_system TEXT,
  FOREIGN KEY (theater_id) REFERENCES theaters(id)
);

-- MOVIES
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  genre TEXT,
  language TEXT,
  format TEXT CHECK (format IN ('2D', '3D')),
  release_date TEXT, -- YYYY-MM-DD
  rating TEXT CHECK (rating IN ('U', 'UA', 'A')),
  cast TEXT,
  crew TEXT,
  poster_url TEXT,
  trailer_url TEXT
);

-- SHOWS
CREATE TABLE IF NOT EXISTS shows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  screen_id INTEGER NOT NULL,
  show_date TEXT NOT NULL, -- YYYY-MM-DD
  show_time TEXT NOT NULL, -- HH:MM
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (screen_id) REFERENCES screens(id),
  UNIQUE (screen_id, show_date, show_time)
);

-- SEATS (PHYSICAL LAYOUT PER SCREEN)
CREATE TABLE IF NOT EXISTS seats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  screen_id INTEGER NOT NULL,
  seat_row TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  seat_category TEXT CHECK (seat_category IN ('REGULAR', 'PREMIUM', 'RECLINER')),
  FOREIGN KEY (screen_id) REFERENCES screens(id),
  UNIQUE (screen_id, seat_row, seat_number)
);

-- SHOW SEAT PRICING
CREATE TABLE IF NOT EXISTS show_seat_pricing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  show_id INTEGER NOT NULL,
  seat_category TEXT NOT NULL,
  price REAL NOT NULL CHECK (price > 0),
  FOREIGN KEY (show_id) REFERENCES shows(id),
  UNIQUE (show_id, seat_category)
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,
  booking_reference TEXT UNIQUE NOT NULL,
  total_amount REAL NOT NULL CHECK (total_amount >= 0),
  status TEXT CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (show_id) REFERENCES shows(id)
);

-- BOOKED SEATS (DOUBLE BOOKING PROTECTION)
CREATE TABLE IF NOT EXISTS booked_seats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,
  seat_id INTEGER NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (show_id) REFERENCES shows(id),
  FOREIGN KEY (seat_id) REFERENCES seats(id),
  UNIQUE (show_id, seat_id)
);
