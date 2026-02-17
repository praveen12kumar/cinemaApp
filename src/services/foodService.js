const fnbRepository = require("../repositories/foodRepository");
const getDB = require("../config/database");
exports.getFnbMenuService = async () => {
  const items = await fnbRepository.getMenuByTheater(1); // hardcoded / default

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    isAvailable: Boolean(item.isAvailable),
  }));
};

exports.createFnbOrderService = async (userId, payload) => {
  const { bookingId, items } = payload;
  const db = await getDB();

  if (!items || items.length === 0) {
    const error = new Error("No food items selected");
    error.statusCode = 400;
    throw error;
  }

  // 1. Validate booking
  const booking = await fnbRepository.getBookingByReference(userId, bookingId);

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  if (booking.status !== "CONFIRMED") {
    const error = new Error(
      "Food order can only be added to confirmed bookings",
    );
    error.statusCode = 400;
    throw error;
  }

  // 2. Fetch food items
  const itemIds = items.map((i) => i.itemId);
  const foodItems = await fnbRepository.getFoodItemsByIds(itemIds);

  if (foodItems.length !== itemIds.length) {
    const error = new Error("One or more food items are invalid");
    error.statusCode = 400;
    throw error;
  }

  // 3. Calculate total amount
  const priceMap = {};
  foodItems.forEach((f) => {
    priceMap[f.id] = f.price;
  });

  let totalAmount = 0;
  for (const item of items) {
    totalAmount += priceMap[item.itemId] * item.quantity;
  }

  // 4. Transaction
  await db.exec("BEGIN IMMEDIATE");

  try {
    // 5. Create food order
    const foodOrderId = await fnbRepository.createFoodOrder(
      booking.id,
      totalAmount,
    );

    // 6. Insert food order items
    await fnbRepository.insertFoodOrderItems(foodOrderId, items);

    await db.exec("COMMIT");

    return {
      bookingId,
      foodOrderId,
      totalAmount,
    };
  } catch (err) {
    await db.exec("ROLLBACK");
    throw err;
  }
};
