const userService = require("../services/userServices");

// signup
exports.signupController = async (req, res) => {
  const { name, email, password, mobileNumber, membershipType } = req.body;

  if (!name || !email || !password || !mobileNumber || !membershipType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await userService.signup({
      name,
      email,
      password,
      mobileNumber,
      membershipType,
    });

    return res.status(201).json({
      success: true,
      error: {},
      data: user,
      message: "Successfully created user",
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      error: error.message,
      data: {},
      message: "User already exists",
    });
  }
};

// login
exports.loginController = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const user = userService.login({ email, password });
    res.status(200).json({
      success: true,
      error: {},
      data: user,
      message: "Successfully logged in user",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      data: {},
      message: "Something went wrong",
    });
  }
};
