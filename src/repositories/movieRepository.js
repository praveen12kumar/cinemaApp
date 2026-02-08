const getDB = require("../config/database");

exports.findAll = async (filters) => {
  const db = await getDB();
  let query = `
    SELECT *
    FROM movies
    WHERE releaseDate <= date('now')
  `;
  const params = [];
  if (filters.language) {
    query += `AND language LIKE ?`;
    params.push(`%${filters.language}%`);
  }

  if (filters.genre) {
    query += `AND genre LIKE ?`;
    params.push(`%${filters.genre}%`);
  }

  if (filters.format) {
    query += `AND format LIKE ?`;
    params.push(`%${filters.format}%`);
  }

  return await db.all(query, params);
};

exports.create = async (movie) => {
  const db = await getDB();
  const {
    title,
    description,
    durationMinutes,
    genre,
    language,
    format,
    releaseDate,
    rating,
    cast,
    posterUrl,
    trailerUrl,
  } = movie;

  const query = `
        INSERT INTO movies (title, description, durationMinutes, genre, language, format, releaseDate, rating, cast, posterUrl, trailerUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  return await db.run(query, [
    title,
    description,
    durationMinutes,
    genre,
    language,
    format,
    releaseDate,
    rating,
    cast,
    posterUrl,
    trailerUrl,
  ]);
};

exports.getAMovieRepo = async (id) => {
  const db = await getDB();
  const query = `
    select * 
    from movies
    where id = ?
  `;
  const movie = await db.get(query, [id]);
  return movie;
};

// upcoming movies
exports.getUpcomingMovieRepo = async () => {
  const db = await getDB();

  const query = `
    SELECT *
    FROM movies
    WHERE releaseDate > date('now')
    ORDER BY releaseDate ASC
  `;

  return await db.all(query);
};
