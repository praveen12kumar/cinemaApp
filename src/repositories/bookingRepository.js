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

exports.getUserBookings = async (userId) => {
  const db = await getDB();
  return await db.all(
    `
      SELECT
        b.id AS bookingDbId,
        b.bookingReference,
        b.totalAmount,
        b.status,
        b.createdAt,

        sh.id AS showId,
        sh.showDate,
        sh.showTime,

        m.title AS movieTitle,
        t.name AS theaterName,
        sc.name AS screenName,

        s.seatRow || s.seatNumber AS seatLabel
      FROM bookings b
      JOIN shows sh ON sh.id = b.showId
      JOIN movies m ON m.id = sh.movieId
      JOIN screens sc ON sc.id = sh.screenId
      JOIN theaters t ON t.id = sc.theaterId
      LEFT JOIN bookedSeats bs ON bs.bookingId = b.id
      LEFT JOIN seats s ON s.id = bs.seatId
      WHERE b.userId = ?
      ORDER BY b.createdAt DESC
      `,
    [userId],
  );
};

exports.getBookingById = async (userId, bookingId) => {
  const db = await getDB();
  return await db.all(
    `
      SELECT
        b.id AS bookingDbId,
        b.bookingReference,
        b.totalAmount,
        b.status,
        b.createdAt,

        sh.id AS showId,
        sh.showDate,
        sh.showTime,

        m.title AS movieTitle,
        t.name AS theaterName,
        sc.name AS screenName,

        s.seatRow || s.seatNumber AS seatLabel
      FROM bookings b
      JOIN shows sh ON sh.id = b.showId
      JOIN movies m ON m.id = sh.movieId
      JOIN screens sc ON sc.id = sh.screenId
      JOIN theaters t ON t.id = sc.theaterId
      LEFT JOIN bookedSeats bs ON bs.bookingId = b.id
      LEFT JOIN seats s ON s.id = bs.seatId
      WHERE b.userId = ?
        AND b.id = ?
      ORDER BY b.createdAt DESC
      `,
    [userId, bookingId],
  );
};

exports.getBookingForCancel = async (userId, bookingReference) => {
  const db = await getDB();

  const query = `
    SELECT id, status
    FROM bookings
    WHERE userId = ?
      AND bookingReference = ?
    `;
  const booking = await db.get(query, userId, bookingReference);
  console.log("Booking", booking);
  return booking;
};

exports.cancelBooking = async (bookingId) => {
  const db = await getDB();
  await db.run(
    `
    UPDATE bookings
    SET status = 'CANCELLED'
    WHERE id = ?
    `,
    [bookingId],
  );

  await db.run(
    `
    DELETE FROM bookedSeats
    WHERE bookingId = ?
    `,
    [bookingId],
  );
};
