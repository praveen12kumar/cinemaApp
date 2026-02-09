const getDB = require("../config/database");

exports.getTheatersByCity = async (cityId) => {
  const db = await getDB();
  const query = `
    Select * 
    from theaters
    where cityId = ?
  `;
  const theaters = await db.all(query, [cityId]);
  return theaters;
};

exports.addTheaterRepo = async (theater) => {
  const db = await getDB();
  const query = `
        INSERT INTO THEATERS(name, cityId, address, totalScreens, facilities)
        Values(?, ?, ?, ?, ?)
    `;

  const newTheater = await db.run(
    query,
    theater.name,
    theater.cityId,
    theater.address,
    theater.totalScreens,
    theater.facilities,
  );
  return newTheater;
};
