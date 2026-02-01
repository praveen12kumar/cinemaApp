const movieService = require("../services/movieService");

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await movieService.getAllMovies();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * controller funtion to create a new movie
 * @returns movie created
 */

exports.createMovie = async (req, res) => {
  try {
    const movie = req.body;
    const createdMovie = await movieService.createMovie(movie);
    res.status(201).json({
      success: true,
      error: {},
      data: createdMovie,
      message: "Successfully created movie",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Something went wrong",
    });
  }
};
