const Category = require("../models/category-model");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// default categories seeded for every new user
const DEFAULT_CATEGORIES = [
  { name: "Food", icon: "restaurant-outline", group: "Food" },
  { name: "Groceries", icon: "cart-outline", group: "Groceries" },
  { name: "Tea/Coffee", icon: "cafe-outline", group: "Food" },
  { name: "Travel", icon: "bus-outline", group: "Travel" },
  { name: "Petrol", icon: "car-outline", group: "Travel" },
  { name: "Recharges", icon: "phone-portrait-outline", group: "Recharges" },
  { name: "Wifi", icon: "wifi-outline", group: "Recharges" },
  { name: "Electricity", icon: "flash-outline", group: "Bills" },
  { name: "Water Bill", icon: "water-outline", group: "Bills" },
  { name: "EMI", icon: "card-outline", group: "EMI" },
  { name: "Home", icon: "home-outline", group: "Home" },
  { name: "Others", icon: "ellipsis-horizontal-outline", group: "Others" },
];

// ─────────────────────────────────────────
// Seed default categories for new user
// called internally after register
// ─────────────────────────────────────────
const seedDefaultCategories = async (userId) => {
  const categories = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    userId,
    type: "Expense",
    isDefault: true,
  }));
  await Category.insertMany(categories);
};

// ─────────────────────────────────────────
// @route   GET /api/v1/categories
// @access  Private
// ─────────────────────────────────────────
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ userId: req.user.id }).sort({
    isDefault: -1,
    name: 1,
  });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/categories
// @access  Private
// ─────────────────────────────────────────
const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, type, group } = req.body;

  if (!name || !type) {
    throw new AppError("Name and type are required", 400);
  }

  // check duplicate name for this user
  const existing = await Category.findOne({ userId: req.user.id, name });
  if (existing) {
    throw new AppError("Category with this name already exists", 400);
  }

  const category = await Category.create({
    userId: req.user.id,
    name,
    icon: icon || "ellipsis-horizontal-outline",
    type,
    group: group || "Others",
    isDefault: false,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/categories/:id
// @access  Private
// ─────────────────────────────────────────
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // only owner can update
  if (category.userId.toString() !== req.user.id) {
    throw new AppError("Not authorized", 403);
  }

  // prevent editing default categories
  if (category.isDefault) {
    throw new AppError("Default categories cannot be edited", 400);
  }

  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updated,
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/categories/:id
// @access  Private
// ─────────────────────────────────────────
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (category.userId.toString() !== req.user.id) {
    throw new AppError("Not authorized", 403);
  }

  if (category.isDefault) {
    throw new AppError("Default categories cannot be deleted", 400);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

module.exports = {
  seedDefaultCategories,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
