const express = require("express");
require("dotenv").config();
const getDB = require("./config/database");
const bodyParser = require("body-parser");

const movieRoutes = require("./routes/movieRoutes");
const userRoutes = require("./routes/userRoutes");
const cityRoutes = require("./routes/cityRoutes");
const theaterRoutes = require("./routes/theaterRoutes");
const screenRoutes = require("./routes/screenRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const foodRoutes = require("./routes/foodRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api", movieRoutes);
app.use("/api/auth", userRoutes);
app.use("/api", cityRoutes);
app.use("/api", theaterRoutes);
app.use("/api", screenRoutes);
app.use("/api", showRoutes);
app.use("/api", bookingRoutes);
app.use("/api", foodRoutes);
app.use("/api", paymentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await getDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Error in connecting Server: ${error.message}`);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("Cinema Booking App");
});

startServer();
