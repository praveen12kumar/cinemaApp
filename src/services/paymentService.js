const paymentsRepo = require("../repositories/paymentRepository");

exports.initiatePaymentService = async (userId, payload) => {
  const { bookingId, paymentMethod, includesFnb } = payload;

  // 1. Validate booking
  const booking = await paymentsRepo.getBookingForPayment(userId, bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Ticket amount
  const ticketAmount = booking.totalAmount;

  // 3. F&B amount (optional)
  let fnbAmount = 0;
  if (includesFnb) {
    fnbAmount = await paymentsRepo.getFoodOrderTotal(booking.id);
  }

  // 4. Fees calculation (simple & acceptable)
  const convenienceFee = 50;
  const subTotal = ticketAmount + fnbAmount + convenienceFee;
  const gst = Math.round(subTotal * 0.18); // 18% GST
  const total = subTotal + gst;

  // 5. Create payment
  const transactionReference = generateTransactionId();

  await paymentsRepo.createPayment(
    booking.id,
    paymentMethod,
    total,
    transactionReference,
  );

  // 6. Response
  return {
    transactionId: transactionReference,
    amount: total,
    breakdown: {
      tickets: ticketAmount,
      fnb: fnbAmount,
      convenienceFee,
      gst,
      total,
    },
  };
};

exports.confirmPaymentService = async (transactionId) => {
  const payment = await paymentsRepo.getPaymentByTransaction(transactionId);

  if (!payment) {
    const error = new Error("Invalid transaction");
    error.statusCode = 404;
    throw error;
  }

  if (payment.status === "SUCCESS") {
    return { transactionId, status: "SUCCESS" };
  }

  await paymentsRepo.markPaymentSuccess(payment.id);

  return {
    transactionId,
    status: "SUCCESS",
  };
};

// simple generator
function generateTransactionId() {
  return "TXN" + Math.floor(100000 + Math.random() * 900000);
}
