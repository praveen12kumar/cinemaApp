const cityRepo = require("../repositories/cityRepository");

exports.addCityService = async (city) => {
  return await cityRepo.addCity(city);
};

exports.getAllCitiesService = async () => {
  return await cityRepo.getAllCities();
};

exports.getCityByIdService = async (id) => {
  return await cityRepo.getCityById(id);
};
