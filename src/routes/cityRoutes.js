const express = require("express");
const router = express.Router();

const cityController = require("../controllers/cityController");

router.get("/cities", cityController.getAllCities);
router.get("/cities/:id", cityController.getCityById);
router.post("/cities", cityController.addCity);

module.exports = router;
