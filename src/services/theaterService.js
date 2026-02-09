const theaterRepo = require("../repositories/theaterRepository");

exports.getAllTheatersByCityService = async (cityId) => {
  const theaters = await theaterRepo.getTheatersByCity(cityId);
  return theaters;
};

exports.addTheaterService = async (theater) => {
  return await theaterRepo.addTheaterRepo(theater);
};
