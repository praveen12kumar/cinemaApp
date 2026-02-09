const screenService = require("../services/screenService");

exports.addScreenController = async (req, res) => {
  const { theaterId, name, screenType, totalCapacity, soundSystem } = req.body;
  try {
    if (!theaterId || !name || !screenType || !totalCapacity || !soundSystem) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newScreen = await screenService.addScreenService({
      theaterId,
      name,
      screenType,
      totalCapacity,
      soundSystem,
    });
    res.status(201).json({
      success: true,
      error: {},
      data: newScreen,
      message: "Successfully added screen",
    });
  } catch (error) {
    console.log("Error");
    res.status(500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Something went wrong",
    });
  }
};
