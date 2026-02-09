const express = require("express");
const router = express.Router();
const screenController = require("../controllers/screenController");

router.post("/screens", screenController.addScreenController);

module.exports = router;
