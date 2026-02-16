const showRepo = require("../repositories/showsRepository");

/**
 * Get shows grouped by theater
 */
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

/**
 * Add show (admin)
 */
exports.addShowService = async (show) => {
  return await showRepo.addedShowRepo(show);
};

/**
 * Get seat layout + availability for a show
 */
exports.getShowSeatsService = async (showId) => {
  // 1. Validate show
  const show = await showRepo.getShowAndScreen(showId);
  if (!show) {
    const error = new Error("Show not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch data in parallel (ONLY existing tables)
  const [seats, seatPrices, bookedSeats] = await Promise.all([
    showRepo.getSeatsByScreen(show.screenId),
    showRepo.getSeatPricesByShow(showId),
    showRepo.getBookedSeats(showId),
  ]);

  // 3. Build price map
  const priceMap = {};
  seatPrices.forEach((p) => {
    priceMap[p.seatCategory] = p.price;
  });

  // 4. Build seat layout
  const seatLayout = buildSeatLayout(seats, priceMap);

  // 5. Final response (schema-safe)
  return {
    screen: show.screenName,
    seatLayout,
    bookedSeats: bookedSeats.map((s) => s.seat),
    blockedSeats: [], // ❗ schema does NOT support blocked seats
  };
};

/**
 * Helper: Build seat layout grouped by category
 */
function buildSeatLayout(seats, priceMap) {
  const layout = {};

  for (const seat of seats) {
    const key = seat.seatCategory.toLowerCase();

    if (!layout[key]) {
      layout[key] = {
        rows: new Set(),
        seatsPerRowMap: {},
        price: priceMap[seat.seatCategory] || 0,
      };
    }

    layout[key].rows.add(seat.seatRow);
    layout[key].seatsPerRowMap[seat.seatRow] =
      (layout[key].seatsPerRowMap[seat.seatRow] || 0) + 1;
  }

  // Normalize Sets → Arrays
  for (const key in layout) {
    const rowsArray = Array.from(layout[key].rows);
    layout[key].rows = rowsArray;
    layout[key].seatsPerRow = layout[key].seatsPerRowMap[rowsArray[0]] || 0;

    delete layout[key].seatsPerRowMap;
  }

  return layout;
}
