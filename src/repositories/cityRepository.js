const getDB = require("../config/database");

exports.getAllCities = async () => {
  const db = await getDB();
  const cities = await db.all("SELECT * FROM cities");
  return cities;
};

exports.getCityById = async (id) => {
  const db = await getDB();
  const city = await db.get("SELECT * FROM cities WHERE id = ?", [id]);
  return city;
};

exports.addCity = async (city) => {
  const db = await getDB();
  const { name, state, theaterCount } = city;
  const query = `
        INSERT INTO cities (name, state, theaterCount)
        VALUES (?, ?, ?)
    `;
  const result = await db.run(query, [name, state, theaterCount]);

  const newCity = await db.get(
    "SELECT * FROM cities WHERE id = ?",
    result.lastID,
  );

  return newCity;
};
