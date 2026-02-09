const showService = require("../services/showsService");

exports.addShowController = async (req, res) => {
  const { movieId, screenId, showDate, showTime } = req.body;
  try {
    if (!movieId || !screenId || !showDate || !showTime) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
        data: {},
        message: "Something went wrong",
      });
    }
    const show = await showService.addShowService(req.body);
    res.status(201).json({
      success: true,
      error: {},
      data: show,
      message: "Successfully added show",
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

exports.getShowController = async (req, res) => {
  const { movieId, cityId, showDate } = req.query;
  try {
    if (!movieId || !cityId || !showDate) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
        data: {},
        message: "Something went wrong",
      });
    }
    const shows = await showService.getShowsService(req.query);
    res.status(200).json({
      success: true,
      error: {},
      data: shows,
      message: "Successfully fetched shows",
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
