const bookingsRepo = require("../repositories/bookingRepository");
const getDB = require("../config/database");

exports.createBookingService = async (userId, payload) => {
  const { showId, seats, totalAmount } = payload;
  const db = await getDB();

  // 1. Validate show
  const show = await bookingsRepo.getShowDetails(showId);

  if (!show) {
    const error = new Error("Show not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Validate seats belong to this screen
  const seatRows = await bookingsRepo.getSeatsByLabels(show.screenId, seats);

  if (seatRows.length !== seats.length) {
    const error = new Error("Invalid seat selection");
    error.statusCode = 400;
    throw error;
  }

  const seatIds = seatRows.map((s) => s.id);

  // 3. Start transaction (CRITICAL)
  await db.exec("BEGIN IMMEDIATE");

  try {
    // 4. Check already booked seats
    const alreadyBooked = await bookingsRepo.checkAlreadyBookedSeats(
      showId,
      seatIds,
    );

    if (alreadyBooked.length > 0) {
      const error = new Error("One or more seats already booked");
      error.statusCode = 409;
      throw error;
    }

    // 5. Generate booking reference
    const bookingReference = generateBookingReference();

    // 6. Create booking
    const bookingId = await bookingsRepo.createBooking(
      userId,
      showId,
      bookingReference,
      totalAmount,
    );

    // 7. Insert booked seats
    await bookingsRepo.insertBookedSeats(bookingId, showId, seatIds);

    // 8. Commit transaction
    await db.exec("COMMIT");

    // 9. Response
    return {
      bookingId: bookingReference,
      totalAmount,
      showDetails: {
        movie: show.movieTitle,
        theater: show.theaterName,
        screen: show.screenName,
        showTime: show.showTime,
        date: show.showDate,
        seats,
      },
    };
  } catch (err) {
    await db.exec("ROLLBACK");
    throw err;
  }
};

// simple + sufficient for assignment
function generateBookingReference() {
  return "PVR" + Math.floor(100000 + Math.random() * 900000);
}

exports.getAllBookingsService = async (userId) => {
  const rows = await bookingsRepo.getUserBookings(userId);

  if (rows.length === 0) {
    return [];
  }

  const bookingsMap = {};

  for (const row of rows) {
    if (!bookingsMap[row.bookingReference]) {
      bookingsMap[row.bookingReference] = {
        bookingId: row.bookingReference,
        status: row.status,
        totalAmount: row.totalAmount,
        createdAt: row.createdAt,
        showDetails: {
          movie: row.movieTitle,
          theater: row.theaterName,
          screen: row.screenName,
          date: row.showDate,
          showTime: row.showTime,
          seats: [],
        },
      };
    }

    if (row.seatLabel) {
      bookingsMap[row.bookingReference].showDetails.seats.push(row.seatLabel);
    }
  }

  return Object.values(bookingsMap);
};

exports.getBookingByIdService = async (userId, bookingId) => {
  const rows = await bookingsRepo.getBookingById(userId, bookingId);

  if (rows.length === 0) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  const first = rows[0];

  const booking = {
    bookingId: first.bookingReference,
    status: first.status,
    totalAmount: first.totalAmount,
    createdAt: first.createdAt,
    showDetails: {
      movie: first.movieTitle,
      theater: first.theaterName,
      screen: first.screenName,
      date: first.showDate,
      showTime: first.showTime,
      seats: [],
    },
  };

  for (const row of rows) {
    if (row.seatLabel) {
      booking.showDetails.seats.push(row.seatLabel);
    }
  }

  return booking;
};

exports.cancelBookingService = async (userId, bookingReference) => {
  const db = await getDB();

  const booking = await bookingsRepo.getBookingForCancel(
    userId,
    bookingReference,
  );

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status !== "CONFIRMED") {
    const error = new Error("Booking cannot be cancelled");
    error.statusCode = 400;
    throw error;
  }

  // transaction for safety
  await db.exec("BEGIN IMMEDIATE");

  try {
    await bookingsRepo.cancelBooking(booking.id);
    await db.exec("COMMIT");
  } catch (err) {
    await db.exec("ROLLBACK");
    throw err;
  }

  return { bookingId: bookingReference };
};
