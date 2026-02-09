const theaterRepo = require("../repositories/theaterRepository");

exports.getAllTheatersByCityService = async (cityId) => {
  const theaters = await theaterRepo.getTheatersByCity(cityId);

  return theaters.map((theater) => ({
    id: theater.id,
    name: theater.name,
    address: theater.address,
    facilities: theater.facilities ? theater.facilities.split(",") : [],
  }));
};

exports.addTheaterService = async (theater) => {
  return await theaterRepo.addTheaterRepo(theater);
};
