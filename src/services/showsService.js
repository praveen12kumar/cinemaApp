const showRepo = require("../repositories/showsRepository");

exports.getShowsService = async (filters) => {
  const shows = await showRepo.getShows(filters);

  const grouped = {};

  for (const row of shows) {
    if (!grouped[row.theaterId]) {
      grouped[row.theaterId] = {
        theaterId: row.theaterId,
        theaterName: row.theaterName,
        address: row.address,
        shows: [],
      };
    }

    grouped[row.theaterId].shows.push({
      showId: row.showId,
      showTime: row.showTime,
      screenName: row.screenName,
      screenType: row.screenType,
      soundSystem: row.soundSystem,
      language: row.movieLanguage,
      format: row.movieFormat,
    });
  }

  return Object.values(grouped);
};

exports.addShowService = async (show) => {
  return await showRepo.addedShowRepo(show);
};
