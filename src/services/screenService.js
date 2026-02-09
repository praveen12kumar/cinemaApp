const screenRepo = require("../repositories/screenRepository");

exports.addScreenService = async (screen) => {
  return await screenRepo.addScreenRepo(screen);
};
