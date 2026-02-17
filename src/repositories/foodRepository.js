const getDB = require("../config/database");

exports.getMenuByTheater = async (theaterId) => {
  const db = await getDB();
  return await db.all(
    `
      SELECT
        id,
        name,
        price,
        isAvailable
      FROM foodItems
      WHERE theaterId = ?
        AND isAvailable = 1
      ORDER BY name
      `,
    [theaterId],
  );
};

exports.getBookingByReference = async (userId, bookingReference) => {
  const db = await getDB();

  return await db.get(
    `
      SELECT id, status
      FROM bookings
      WHERE userId = ?
        AND bookingReference = ?
      `,
    [userId, bookingReference],
  );
};

exports.getFoodItemsByIds = async (itemIds) => {
  const placeholders = itemIds.map(() => "?").join(",");
  const db = await getDB();

  return await db.all(
    `
      SELECT id, price
      FROM foodItems
      WHERE id IN (${placeholders})
        AND isAvailable = 1
      `,
    itemIds,
  );
};

exports.createFoodOrder = async (bookingId, totalAmount) => {
  const db = await getDB();
  const result = await db.run(
    `
      INSERT INTO foodOrders (bookingId, totalAmount)
      VALUES (?, ?)
      `,
    [bookingId, totalAmount],
  );

  return result.lastID;
};

exports.insertFoodOrderItems = async (foodOrderId, items) => {
  const db = await getDB();
  const sql = `INSERT INTO foodOrderItems (foodOrderId, foodItemId, quantity)
       VALUES (?, ?, ?)`;

  for (const item of items) {
    await db.run(sql, [foodOrderId, item.itemId, item.quantity]);
  }
};
