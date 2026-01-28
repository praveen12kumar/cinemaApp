import path from "path";
import fs from "fs";
import sqlite from "sqlite3";
import { open } from "sqlite";

const dbPath = path.join(__dirname, "../../database/app.db");
const schemaPath = path.join(__dirname, "schema.sql");

let db = null;

const connectDB = async () => {
  if (db) {
    return db;
  }
  db = await open({
    filename: dbPath,
    driver: sqlite.Database,
  });
  if (fs.existsSync(schemaPath)) {
    const sql = fs.readFileSync(schemaPath, "utf-8");
    await db.exec(sql);
  }
  return db;
};
export default connectDB;
