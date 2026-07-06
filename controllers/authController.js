const asyncHandler = require("../middleware/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/User");
const {
  registerUser,
  loginUser,
} = require("../services/authService");
// ================= REGISTER =================
const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, user, "User Registered Successfully"));
});
// ================= LOGIN =================
const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Login Successful"));
});
// ================= GET PROFILE =================
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile Fetched Successfully"));
});
// ================= UPDATE PROFILE =================
const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Profile Updated Successfully")
    );
});
// ================= DELETE USER =================
const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User Deleted Successfully"));
});
module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteUser,
};