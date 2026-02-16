const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authentication");

const bookingController = require("../controllers/bookingController");

router.post(
  "/bookings",
  authenticate,
  bookingController.createBookingController,
);

module.exports = router;
