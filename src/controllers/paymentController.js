const paymentsService = require("../services/paymentService");

exports.initiatePaymentController = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await paymentsService.initiatePaymentService(
      userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      error: {},
      data: result,
      message: "Payment initiated",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Payment initiation failed",
    });
  }
};

exports.confirmPaymentController = async (req, res) => {
  const { transactionId } = req.body;

  try {
    const result = await paymentsService.confirmPaymentService(transactionId);

    res.status(200).json({
      success: true,
      error: {},
      data: result,
      message: "Payment successful",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Payment confirmation failed",
    });
  }
};
