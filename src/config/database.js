const path = require("path");
const fs = require("fs");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "../../database/app.db");
const schemaPath = path.join(__dirname, "schema.sql");

let db = null;

const connectDB = async () => {
  if (db) {
    return db;
  }
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, "utf-8");
    await db.exec(sql);
  }
  return db;
};

const getDB = async () => {
  if (!db) {
    db = await connectDB();
  }
  return db;
};

module.exports = getDB;
