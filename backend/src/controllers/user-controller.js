const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const asyncHandler = require("../utils/asynchandler");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5d" },
  );
};

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/register
// @access  Public
// ─────────────────────────────────────────
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, currency } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, Email and Password are required", 400);
  }

  //check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already registered", 400);

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    currency,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
    },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/auth/login
// @access  Public
// ─────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new AppError("Email and Password are required", 400);

  //find user
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("Invalid email or password", 401);

  //compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
    },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/auth/me
// @access  Private (requires token)
// ─────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      createdAt: user.createdAt,
    },
  });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/auth/update-profile
// @access  Private
// ─────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name, currency } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, currency },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
    },
  });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/auth/change-password
// @access  Private
// ─────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError("Current Password and New Password are required", 400);
  }

  const user = await User.findById(req.user.id).select("+password");

  //verify password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new AppError("Current Password is incorrect", 401);

  //hash new password and save
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/auth/delete-account
// @access  Private
// ─────────────────────────────────────────
const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // optionally: delete all user's transactions, categories, budgets too
  // await Transaction.deleteMany({ userId: req.user.id });
  // await Category.deleteMany({ userId: req.user.id });
  // await Budget.deleteMany({ userId: req.user.id });

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});

module.exports = {
  registerUser,
  login,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
};
