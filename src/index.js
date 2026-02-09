const express = require("express");
require("dotenv").config();
const getDB = require("./config/database");
const bodyParser = require("body-parser");

const movieRoutes = require("./routes/movieRoutes");
const userRoutes = require("./routes/userRoutes");
const cityRoutes = require("./routes/cityRoutes");
const theaterRoutes = require("./routes/theaterRoutes");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api", movieRoutes);
app.use("/api/auth", userRoutes);
app.use("/api", cityRoutes);
app.use("/api", theaterRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connect = await getDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Error in connecting Server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
