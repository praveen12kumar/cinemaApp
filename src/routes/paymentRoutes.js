const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authenticate = require("../middlewares/authentication");

router.post(
  "/payments/initiate",
  authenticate,
  paymentController.initiatePaymentController,
);

router.post(
  "/payments/confirm",
  authenticate,
  paymentController.confirmPaymentController,
);

module.exports = router;
