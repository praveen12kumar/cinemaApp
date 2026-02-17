const fnbService = require("../services/foodService");

exports.getFnbMenuController = async (req, res) => {
  try {
    const items = await fnbService.getFnbMenuService();

    res.status(200).json({
      success: true,
      error: {},
      data: {
        items,
      },
      message: "Successfully fetched F&B menu",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Something went wrong",
    });
  }
};

exports.createFnbOrderController = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await fnbService.createFnbOrderService(userId, req.body);

    res.status(201).json({
      success: true,
      error: {},
      data: result,
      message: "Food order added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Failed to add food order",
    });
  }
};
