const getDB = require("../config/database");

exports.getShowDetails = async (showId) => {
  const db = await getDB();
  return await db.get(
    `
      SELECT
        sh.id AS showId,
        sh.showDate,
        sh.showTime,
        m.title AS movieTitle,
        sc.id AS screenId,
        sc.name AS screenName,
        t.name AS theaterName
      FROM shows sh
      JOIN movies m ON m.id = sh.movieId
      JOIN screens sc ON sc.id = sh.screenId
      JOIN theaters t ON t.id = sc.theaterId
      WHERE sh.id = ?
      `,
    [showId],
  );
};

exports.getSeatsByLabels = async (screenId, seatLabels) => {
  const placeholders = seatLabels.map(() => "?").join(",");
  const db = await getDB();
  return await db.all(
    `
      SELECT
        id,
        seatRow || seatNumber AS seatLabel
      FROM seats
      WHERE screenId = ?
        AND (seatRow || seatNumber) IN (${placeholders})
      `,
    [screenId, ...seatLabels],
  );
};

exports.checkAlreadyBookedSeats = async (showId, seatIds) => {
  const db = await getDB();
  const placeholders = seatIds.map(() => "?").join(",");

  return await db.all(
    `
      SELECT seatId
      FROM bookedSeats
      WHERE showId = ?
        AND seatId IN (${placeholders})
      `,
    [showId, ...seatIds],
  );
};

exports.createBooking = async (
  userId,
  showId,
  bookingReference,
  totalAmount,
) => {
  const db = await getDB();
  const result = await db.run(
    `
      INSERT INTO bookings (
        userId,
        showId,
        bookingReference,
        totalAmount,
        status
      ) VALUES (?, ?, ?, ?, 'CONFIRMED')
      `,
    [userId, showId, bookingReference, totalAmount],
  );

  return result.lastID;
};

exports.insertBookedSeats = async (bookingId, showId, seatIds) => {
  const db = await getDB();
  const stmt = `
      INSERT INTO bookedSeats (bookingId, showId, seatId)
      VALUES (?, ?, ?)
    `;

  for (const seatId of seatIds) {
    await db.run(stmt, [bookingId, showId, seatId]);
  }
};

module.exports = BookingRepository;
