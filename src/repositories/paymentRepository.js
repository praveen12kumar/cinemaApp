const getDB = require("../config/database");

exports.getBookingForPayment = async (userId, bookingReference) => {
  const db = await getDB();
  return await db.get(
    `
    SELECT id, totalAmount, status
    FROM bookings
    WHERE userId = ?
      AND bookingReference = ?
    `,
    [userId, bookingReference],
  );
};

exports.getFoodOrderTotal = async (bookingId) => {
  const db = await getDB();
  const row = await db.get(
    `
    SELECT SUM(totalAmount) AS total
    FROM foodOrders
    WHERE bookingId = ?
    `,
    [bookingId],
  );
  return row?.total || 0;
};

exports.createPayment = async (
  bookingId,
  paymentMethod,
  amount,
  transactionReference,
) => {
  const db = await getDB();
  await db.run(
    `
    INSERT INTO payments (
      bookingId,
      paymentMethod,
      amount,
      status,
      transactionReference
    ) VALUES (?, ?, ?, 'PENDING', ?)
    `,
    [bookingId, paymentMethod, amount, transactionReference],
  );
};

exports.getPaymentByTransaction = async (transactionReference) => {
  const db = await getDB();
  return await db.get(
    `
    SELECT id, bookingId, status
    FROM payments
    WHERE transactionReference = ?
    `,
    [transactionReference],
  );
};

exports.markPaymentSuccess = async (paymentId) => {
  const db = await getDB();
  await db.run(
    `
    UPDATE payments
    SET status = 'SUCCESS',
        paidAt = datetime('now')
    WHERE id = ?
    `,
    [paymentId],
  );
};
