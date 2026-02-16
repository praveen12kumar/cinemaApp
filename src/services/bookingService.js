const bookingsRepo = require("../repositories/bookingRepository");
const getDB = require("../config/database");

exports.createBookingService = async (userId, payload) => {
  const { showId, seats, totalAmount } = payload;
  const db = await getDB();

  // 1. Validate show
  const show = await bookingsRepo.getShowDetails(showId);
  console.log(show);
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
