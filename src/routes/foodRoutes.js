const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");
const authenticate = require("../middlewares/authentication");

router.get("/fnb/menu", foodController.getFnbMenuController);
router.post(
  "/fnb/orders",
  authenticate,
  foodController.createFnbOrderController,
);

module.exports = router;
