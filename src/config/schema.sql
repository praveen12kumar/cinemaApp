-- =========================================
-- MOVIE BOOKING APP SCHEMA (camelCase)
-- SQLite Compatible
-- =========================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobileNumber TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  membershipType TEXT CHECK (membershipType IN ('SILVER', 'GOLD', 'PLATINUM')),
  createdAt TEXT DEFAULT (datetime('now'))
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
  cityId INTEGER NOT NULL,
  address TEXT NOT NULL,
  totalScreens INTEGER NOT NULL CHECK (totalScreens > 0),
  facilities TEXT,
  FOREIGN KEY (cityId) REFERENCES cities(id)
);

-- SCREENS
CREATE TABLE IF NOT EXISTS screens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theaterId INTEGER NOT NULL,
  name TEXT NOT NULL,
  screenType TEXT CHECK (screenType IN ('2D', '3D', 'IMAX', '4DX')),
  totalCapacity INTEGER NOT NULL CHECK (totalCapacity > 0),
  soundSystem TEXT,
  FOREIGN KEY (theaterId) REFERENCES theaters(id)
);

-- MOVIES
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  durationMinutes INTEGER NOT NULL CHECK (durationMinutes > 0),
  genre TEXT NOT NULL,
  language TEXT NOT NULL,
  format TEXT NOT NULL,
  releaseDate TEXT NOT NULL,          -- YYYY-MM-DD
  rating REAL CHECK (rating >= 0 AND rating <= 10),
  cast TEXT NOT NULL,                 -- JSON string
  posterUrl TEXT,
  trailerUrl TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);


-- ACTORS
CREATE TABLE IF NOT EXISTS actors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  gender TEXT,
  dateOfBirth TEXT
);

-- MOVIE CAST (Many-to-Many)
CREATE TABLE IF NOT EXISTS movieCast (
  movieId INTEGER NOT NULL,
  actorId INTEGER NOT NULL,
  roleName TEXT,
  billingOrder INTEGER,
  PRIMARY KEY (movieId, actorId),
  FOREIGN KEY (movieId) REFERENCES movies(id),
  FOREIGN KEY (actorId) REFERENCES actors(id)
);

-- CREW MEMBERS
CREATE TABLE IF NOT EXISTS crewMembers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  department TEXT -- Director, Music, Cinematography
);

-- MOVIE CREW (Many-to-Many)
CREATE TABLE IF NOT EXISTS movieCrew (
  movieId INTEGER NOT NULL,
  crewId INTEGER NOT NULL,
  role TEXT,
  PRIMARY KEY (movieId, crewId),
  FOREIGN KEY (movieId) REFERENCES movies(id),
  FOREIGN KEY (crewId) REFERENCES crewMembers(id)
);

-- SHOWS
CREATE TABLE IF NOT EXISTS shows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movieId INTEGER NOT NULL,
  screenId INTEGER NOT NULL,
  showDate TEXT NOT NULL, -- YYYY-MM-DD
  showTime TEXT NOT NULL, -- HH:MM
  FOREIGN KEY (movieId) REFERENCES movies(id),
  FOREIGN KEY (screenId) REFERENCES screens(id),
  UNIQUE (screenId, showDate, showTime)
);

-- SEATS (PER SCREEN)
CREATE TABLE IF NOT EXISTS seats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  screenId INTEGER NOT NULL,
  seatRow TEXT NOT NULL,
  seatNumber INTEGER NOT NULL,
  seatCategory TEXT CHECK (seatCategory IN ('REGULAR', 'PREMIUM', 'RECLINER')),
  FOREIGN KEY (screenId) REFERENCES screens(id),
  UNIQUE (screenId, seatNumber)
);

-- SHOW SEAT PRICING
CREATE TABLE IF NOT EXISTS showSeatPricing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  showId INTEGER NOT NULL,
  seatCategory TEXT NOT NULL,
  price REAL NOT NULL CHECK (price > 0),
  FOREIGN KEY (showId) REFERENCES shows(id),
  UNIQUE (showId, seatCategory)
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  showId INTEGER NOT NULL,
  bookingReference TEXT UNIQUE NOT NULL,
  totalAmount REAL NOT NULL CHECK (totalAmount >= 0),
  status TEXT CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
  createdAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (showId) REFERENCES shows(id)
);

-- BOOKED SEATS (DOUBLE BOOKING PROTECTION)
CREATE TABLE IF NOT EXISTS bookedSeats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bookingId INTEGER NOT NULL,
  showId INTEGER NOT NULL,
  seatId INTEGER NOT NULL,
  FOREIGN KEY (bookingId) REFERENCES bookings(id),
  FOREIGN KEY (showId) REFERENCES shows(id),
  FOREIGN KEY (seatId) REFERENCES seats(id),
  UNIQUE (showId, seatId)
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bookingId INTEGER NOT NULL,
  paymentMethod TEXT,
  amount REAL NOT NULL,
  status TEXT CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
  transactionReference TEXT,
  paidAt TEXT,
  FOREIGN KEY (bookingId) REFERENCES bookings(id)
);

-- FOOD ITEMS
CREATE TABLE IF NOT EXISTS foodItems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theaterId INTEGER NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL CHECK (price > 0),
  isAvailable INTEGER DEFAULT 1,
  FOREIGN KEY (theaterId) REFERENCES theaters(id)
);

-- FOOD ORDERS
CREATE TABLE IF NOT EXISTS foodOrders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bookingId INTEGER NOT NULL,
  totalAmount REAL NOT NULL CHECK (totalAmount >= 0),
  FOREIGN KEY (bookingId) REFERENCES bookings(id)
);

-- FOOD ORDER ITEMS
CREATE TABLE IF NOT EXISTS foodOrderItems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  foodOrderId INTEGER NOT NULL,
  foodItemId INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  FOREIGN KEY (foodOrderId) REFERENCES foodOrders(id),
  FOREIGN KEY (foodItemId) REFERENCES foodItems(id)
);
