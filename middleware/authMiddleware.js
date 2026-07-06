const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");
const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        throw new ApiError(401, "Not Authorized. Token Missing");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
        throw new ApiError(401, "User not found");
    }
    req.user = user;
    next();
});
 
module.exports = {
  protect,
   
};