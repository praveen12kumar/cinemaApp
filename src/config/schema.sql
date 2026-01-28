CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  membership_type TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  state TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS theaters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city_id INTEGER NOT NULL,
  address TEXT NOT NULL,
  total_screens INTEGER NOT NULL,
  facilities TEXT,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE IF NOT EXISTS screens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theater_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  screen_type TEXT NOT NULL,
  total_capacity INTEGER NOT NULL,
  sound_system TEXT,
  FOREIGN KEY (theater_id) REFERENCES theaters(id)
);

CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  genre TEXT,
  language TEXT,
  format TEXT,
  release_date TEXT,
  rating TEXT,
  cast TEXT,
  crew TEXT,
  poster_url TEXT,
  trailer_url TEXT
);

CREATE TABLE IF NOT EXISTS shows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  screen_id INTEGER NOT NULL,
  show_date TEXT NOT NULL,
  show_time TEXT NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (screen_id) REFERENCES screens(id),
  UNIQUE (screen_id, show_date, show_time)
);

CREATE TABLE IF NOT EXISTS seats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  screen_id INTEGER NOT NULL,
  seat_row TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  seat_category TEXT NOT NULL,
  FOREIGN KEY (screen_id) REFERENCES screens(id),
  UNIQUE (screen_id, seat_row, seat_number)
);

CREATE TABLE IF NOT EXISTS show_seat_pricing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  show_id INTEGER NOT NULL,
  seat_category TEXT NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (show_id) REFERENCES shows(id),
  UNIQUE (show_id, seat_category)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  show_id INTEGER NOT NULL,
  booking_reference TEXT UNIQUE NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (show_id) REFERENCES shows(id)
);

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
