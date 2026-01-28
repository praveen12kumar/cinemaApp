const movieRepo = require("../repositories/movieRepository");

exports.getAllMovies = async () => {
  return await movieRepo.findAll();
};

exports.createMovie = async (movie) => {
  return await movieRepo.create(movie);
};
