const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userController.signupController);
router.post("/signin", userController.loginController);

module.exports = router;
