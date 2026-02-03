const getDB = require("../config/database");

exports.getAllUsers = async () => {
  const db = await getDB();
  const users = await db.all("SELECT * FROM users");
  return users;
};

exports.createUser = async (data) => {
  const { name, email, password, mobileNumber, membershipType } = data;
  const db = await getDB();

  const query = `
        INSERT INTO users (name, email, password, mobileNumber, membershipType)
        VALUES (?, ?, ?, ?, ?)
    `;
  return await db.run(query, [
    name,
    email,
    password,
    mobileNumber,
    membershipType,
  ]);
};

exports.getUserByEmail = async (email) => {
  const db = await getDB();
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  return user;
};

exports.getUserById = async (id) => {
  const db = await getDB();
  const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
  return user;
};
