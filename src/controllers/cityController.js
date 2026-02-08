const cityService = require("../services/cityService");

exports.getAllCities = async (req, res) => {
  try {
    const cities = await cityService.getAllCitiesService();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await cityService.getCityByIdService(id);
    res.status(200).json(city);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCity = async (req, res) => {
  try {
    const city = req.body;
    const { name, state, theaterCount } = city;

    if (!name || !state || !theaterCount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newCity = await cityService.addCityService({
      name,
      state,
      theaterCount,
    });
    res.status(201).json(newCity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
