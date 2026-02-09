const express = require("express");
const router = express.Router();
const showController = require("../controllers/showsController");

router.post("/shows", showController.addShowController);
router.get("/shows", showController.getShowController);

module.exports = router;
