const express = require("express");
require("dotenv").config();

const connectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Error in connecting Server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
