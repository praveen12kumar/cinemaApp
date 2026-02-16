const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authentication");

const bookingController = require("../controllers/bookingController");

router.post(
  "/bookings",
  authenticate,
  bookingController.createBookingController,
);

router.get(
  "/bookings",
  authenticate,
  bookingController.getAllBookingsController,
);

router.get("/bookings/:id", authenticate, bookingController.getBookingById);

router.post(
  "/bookings/:bookingId/cancel",
  authenticate,
  bookingController.cancelBookingController,
);

module.exports = router;
