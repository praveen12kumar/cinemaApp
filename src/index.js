const express = require("express");
require("dotenv").config();
const getDB = require("./config/database");

const movieRoutes = require("./routes/movieRoutes");

const app = express();
app.use(express.json());
app.use("/movies", movieRoutes);

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
