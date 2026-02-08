const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userController.signupController);
router.post("/login", userController.loginController);

module.exports = router;
