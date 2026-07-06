const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");
// ================= REGISTER =================
const registerUser = async (userData) => {
  const { name, email, password, role, phone } = userData;
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
  });
  // Remove password
  const userResponse = user.toObject();
  delete userResponse.password;
  return userResponse;
};
// ================= LOGIN =================
const loginUser = async (loginData) => {
  const { email, password } = loginData;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid Credentials");
  }
  const token = generateToken(user);
  const userResponse = user.toObject();
  delete userResponse.password;
  return {
    token,
    user: userResponse,
  };
};
module.exports = {
  registerUser,
  loginUser,
};