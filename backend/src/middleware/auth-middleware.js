const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");
const AppError = require("../utils/appError");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  //get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new AppError("Not authorized, no token", 401);

  //verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //attach user to request
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    throw new AppError("User no longer exists", 401);
  }

  next();
});

module.exports = { protect };
