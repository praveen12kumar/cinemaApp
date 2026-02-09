const getDB = require("../config/database");

exports.addScreenRepo = async (screen) => {
  const db = await getDB();
  const query = `
        INSERT INTO SCREENS(theaterId, name, screenType, totalCapacity, soundSystem)
        values(?, ?, ?, ?, ?)
    `;
  const newScreen = await db.run(
    query,
    screen.theaterId,
    screen.name,
    screen.screenType,
    screen.totalCapacity,
    screen.soundSystem,
  );
  return newScreen;
};
