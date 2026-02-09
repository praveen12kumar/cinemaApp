const express = require("express");
const router = express.Router();
const theaterController = require("../controllers/theaterController");
const authenticate = require("../middlewares/authentication");

router.post("/theaters", theaterController.addTheater);
router.get("/theaters/:cityId", theaterController.getAllTheatersByCity);

module.exports = router;
