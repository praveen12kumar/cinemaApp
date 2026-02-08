const movieService = require("../services/movieService");

exports.getAllMovies = async (req, res) => {
  try {
    const { language, genre, rating, format } = req.query;
    console.log(language);
    const movies = await movieService.getAllMovies({
      language,
      genre,
      rating,
      format,
    });
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
    const {
      title,
      description,
      durationMinutes,
      genre,
      language,
      format,
      releaseDate,
      cast,
      posterUrl,
      trailerUrl,
    } = req.body;

    if (
      !title ||
      !description ||
      !durationMinutes ||
      !genre ||
      !language ||
      !format ||
      !releaseDate ||
      !cast ||
      !posterUrl ||
      !trailerUrl
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
        data: {},
        message: "Something went wrong",
      });
    }

    const createdMovie = await movieService.createMovie(req.body);
    res.status(201).json({
      success: true,
      error: {},
      data: createdMovie,
      message: "Successfully created movie",
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Something went wrong",
    });
  }
};

// get a movie

exports.getAMovie = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Enter movie id",
        data: {},
        message: "Something went wrong",
      });
    }

    const movie = await movieService.getAMovieService(id);
    res.status(200).json({
      success: true,
      error: {},
      data: movie,
      message: "Successfully fetched movie",
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Something went wrong",
    });
  }
};

// upcoming movies

exports.getUpcomingMovies = async (req, res) => {
  try {
    const movies = await movieService.getUpcomingMovies();
    console.log("movies", movies);
    res.status(200).json({
      success: true,
      error: {},
      data: movies,
      message: "Successfully fetched movies",
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
