const getDB = require("../config/database");

exports.findAll = async () => {
  const db = await getDB();
  const movies = await db.all("SELECT * FROM movies");
  return movies;
};

exports.create = async (movie) => {
  const db = await getDB();
  const {
    title,
    description,
    duration_minutes,
    genre,
    language,
    format,
    release_date,
    rating,
    cast,
    posterUrl,
    trailerUrl,
  } = movie;

  const query = `
        INSERT INTO movies (title, description, duration_minutes, genre, language, format, release_date, rating, cast, posterUrl, trailerUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  return await db.run(query, [
    title,
    description,
    duration_minutes,
    genre,
    language,
    format,
    release_date,
    rating,
    cast,
    posterUrl,
    trailerUrl,
  ]);
};
