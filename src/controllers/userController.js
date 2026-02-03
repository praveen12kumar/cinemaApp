const userService = require("../services/userServices");

// signup
exports.signupController = async (req, res) => {
  const { name, email, password, mobileNumber, membershipType } = req.body;

  if (!name || !email || !password || !mobileNumber || !membershipType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await userService.signupService({
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
exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const data = await userService.loginService({ email, password });

    const newUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      mobileNumber: data.user.mobileNumber,
      membershipType: data.user.membershipType,
    };

    res.status(200).json({
      success: true,
      error: {},
      token: data.token,
      data: newUser,
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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsersService();
    res.status(200).json({
      success: true,
      error: {},
      data: users,
      message: "Successfully fetched users",
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

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserByIdService(id);
    res.status(200).json({
      success: true,
      error: {},
      data: user,
      message: "Successfully fetched user",
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
