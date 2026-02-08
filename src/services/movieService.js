const movieRepo = require("../repositories/movieRepository");

exports.getAllMovies = async (filters) => {
  const movies = await movieRepo.findAll(filters);

  if (!Array.isArray(movies)) {
    return [];
  }

  return movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    description: movie.description,
    duration: `${movie.durationMinutes} mins`,
    rating: "UA",
    genre: movie.genre ? movie.genre.split(",") : [],
    language: movie.language ? movie.language.split(",") : [],
    formats: movie.format ? movie.format.split(",") : [],
    posterUrl: movie.posterUrl,
    releaseDate: movie.releaseDate,
    imdbRating: movie.rating,
  }));
};

exports.createMovie = async (movie) => {
  return await movieRepo.create(movie);
};

exports.getAMovieService = async (id) => {
  return await movieRepo.getAMovieRepo(id);
};

exports.getUpcomingMovies = async () => {
  return await movieRepo.getUpcomingMovieRepo();
};
