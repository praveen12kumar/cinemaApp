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
