const theaterService = require("../services/theaterService");

exports.addTheater = async (req, res) => {
  const { name, cityId, address, totalScreens, facilities } = req.body;
  if (!name || !cityId || !address || !totalScreens || !facilities) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
      data: {},
      message: "Something went wrong",
    });
  }
  try {
    const newTheater = await theaterService.addTheaterService({
      name,
      cityId,
      address,
      totalScreens,
      facilities,
    });
    res.status(201).json({
      success: true,
      error: {},
      data: newTheater,
      message: "Successfully added theater",
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

exports.getAllTheatersByCity = async (req, res) => {
  const { cityId } = req.params;
  try {
    if (!cityId) {
      return res.status(400).json({
        success: false,
        error: "Enter valid city id",
        data: {},
        message: "Something went wrong",
      });
    }
    const theaters = await theaterService.getAllTheatersByCityService(cityId);
    res.status(200).json({
      success: true,
      error: {},
      data: theaters,
      message: "Successfully fetched theaters",
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
