const userRepo = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signupService = async (data) => {
  // check for user is already exists
  const user = await userRepo.getUserByEmail(data.email);
  if (user) {
    throw new Error("User already exists");
  }

  // encrypt the password
  const salt = await bcrypt.genSalt(10);
  data.password = await bcrypt.hash(data.password, salt);

  const newUser = await userRepo.createUser({
    name: data.name,
    email: data.email,
    password: data.password,
    mobileNumber: data.mobileNumber,
    membershipType: data.membershipType,
  });

  return newUser;
};

exports.loginService = async (data) => {
  // check for user is already exists
  const user = await userRepo.getUserByEmail(data.email);
  if (!user) {
    throw new Error("User not found");
  }

  // verify password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid user or password");
  }

  // generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
  );
  return { token, user };
};

exports.getAllUsersService = async () => {
  const users = await userRepo.getAllUsers();
  if (!users) {
    throw new Error("No users found");
  }
  return users;
};

exports.getUserByIdService = async (id) => {
  const user = await userRepo.getUserById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
