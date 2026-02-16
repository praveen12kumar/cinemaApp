const getDB = require("../config/database");

exports.addedShowRepo = async (show) => {
  const db = await getDB();

  const query = `
        INSERT INTO shows (movieId, screenId, showDate, showTime)
        VALUES (?, ?, ?, ?)
    `;
  const newShow = await db.run(
    query,
    show.movieId,
    show.screenId,
    show.showDate,
    show.showTime,
  );
  return newShow;
};

exports.getShows = async ({ movieId, cityId, showDate }) => {
  const db = await getDB();

  const query = `
    SELECT
      shows.id AS showId,
      shows.showDate,
      shows.showTime,

      movies.language AS movieLanguage,
      movies.format AS movieFormat,

      screens.name AS screenName,
      screens.screenType,
      screens.soundSystem,

      theaters.id AS theaterId,
      theaters.name AS theaterName,
      theaters.address

    FROM shows
    JOIN movies
      ON shows.movieId = movies.id
    JOIN screens
      ON shows.screenId = screens.id
    JOIN theaters
      ON screens.theaterId = theaters.id
    JOIN cities
      ON theaters.cityId = cities.id

    WHERE shows.movieId = ?
      AND cities.id = ?
      AND shows.showDate = ?

    ORDER BY theaters.id, shows.showTime
  `;

  return await db.all(query, [movieId, cityId, showDate]);
};

exports.getShowDetails = async (showId) => {
  const db = await getDB();
  return await db.get(
    `
      SELECT 
        sh.id AS showId,
        sc.id AS screenId,
        sc.name AS screenName
      FROM shows sh
      JOIN screens sc ON sc.id = sh.screenId
      WHERE sh.id = ?
      `,
    [showId],
  );
};

exports.getShowAndScreen = async (showId) => {
  console.log(showId);
  const db = await getDB();
  return await db.get(
    `
      SELECT 
        sh.id AS showId,
        sc.id AS screenId,
        sc.name AS screenName
      FROM shows sh
      JOIN screens sc ON sc.id = sh.screenId
      WHERE sh.id = ?
      `,
    [showId],
  );
};

exports.getSeatsByScreen = async (screenId) => {
  const db = await getDB();
  const seats = await db.all(
    `
      SELECT 
        seatRow,
        seatNumber,
        seatCategory
      FROM seats
      WHERE screenId = ?
      ORDER BY seatCategory, seatRow, seatNumber
      `,
    [1],
  );
  return seats;
};

exports.getSeatPricesByShow = async (showId) => {
  const db = await getDB();
  return await db.all(
    `
      SELECT 
        seatCategory,
        price
      FROM showSeatPricing
      WHERE showId = ?
      `,
    [showId],
  );
};

exports.getBookedSeats = async (showId) => {
  const db = await getDB();
  return await db.all(
    `
      SELECT 
        s.seatRow || s.seatNumber AS seat
      FROM bookedSeats bs
      JOIN seats s ON s.id = bs.seatId
      WHERE bs.showId = ?
      `,
    [showId],
  );
};

exports.getBlockedSeats = async (showId) => {
  const db = await getDB();
  return await db.all(
    `
      SELECT 
        s.seatRow || s.seatNumber AS seat
      FROM seatLocks sl
      JOIN seats s ON s.id = sl.seatId
      WHERE sl.showId = ?
        AND sl.expiresAt > datetime('now')
      `,
    [showId],
  );
};
