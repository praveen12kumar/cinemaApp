const bookingsService = require("../services/bookingService");

// create booking
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

// get all bookings by an user
exports.getAllBookingsController = async (req, res) => {
  const userId = req.user.id; // from JWT
  try {
    const result = await bookingsService.getAllBookingsService(userId);

    res.status(200).json({
      success: true,
      error: {},
      data: result,
      message: "Successfully fetched all bookings",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Something went wrong",
    });
  }
};

exports.getBookingById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const result = await bookingsService.getBookingByIdService(userId, id);
    res.status(200).json({
      success: true,
      error: {},
      data: result,
      message: "Successfully fetched booking",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Something went wrong",
    });
  }
};

exports.cancelBookingController = async (req, res) => {
  const userId = req.user.id;
  const { bookingId } = req.params;

  try {
    const result = await bookingsService.cancelBookingService(
      userId,
      bookingId,
    );

    res.status(200).json({
      success: true,
      error: {},
      data: result,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Cancellation failed",
    });
  }
};
