const bookingsService = require("../services/bookingService");

exports.createBookingController = async (req, res) => {
  const userId = req.user.id; // from JWT

  try {
    const result = await bookingsService.createBookingService(userId, req.body);

    res.status(201).json({
      success: true,
      error: {},
      data: result,
      message: "Booking confirmed",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Booking failed",
    });
  }
};
