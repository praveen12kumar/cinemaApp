const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/movies", movieController.getAllMovies);
router.post("/movies", movieController.createMovie);
router.get("/movies/upcoming", movieController.getUpcomingMovies);
router.get("/movies/:id", movieController.getAMovie);

module.exports = router;
