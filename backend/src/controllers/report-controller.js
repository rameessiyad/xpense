const Transaction = require("../models/transaction-model");
const asyncHandler = require("../utils/asyncHandler");

// ─────────────────────────────────────────
// @route   GET /api/v1/reports/monthly
// @access  Private
// ─────────────────────────────────────────
const getMonthlyReport = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  // total expense and income
  const summary = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const totalExpense = summary.find((s) => s._id === "Expense")?.total || 0;
  const totalIncome = summary.find((s) => s._id === "Income")?.total || 0;
  const totalCount = summary.reduce((sum, s) => sum + s.count, 0);
  const avgPerDay = Math.round(
    totalExpense / new Date(year, month, 0).getDate(),
  );

  // category wise breakdown
  const categoryBreakdown = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        type: "Expense",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category.group",
        amount: { $sum: "$amount" },
        count: { $sum: 1 },
        icon: { $first: "$category.icon" },
      },
    },
    { $sort: { amount: -1 } },
  ]);

  // add percentage to each category
  const categoryWithPercentage = categoryBreakdown.map((cat) => ({
    group: cat._id,
    amount: cat.amount,
    count: cat.count,
    icon: cat.icon,
    percentage:
      totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0,
  }));

  // weekly breakdown
  const weeklyBreakdown = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        type: "Expense",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: { $week: "$date" },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    month,
    year,
    totalExpense,
    totalIncome,
    totalCount,
    avgPerDay,
    categoryBreakdown: categoryWithPercentage,
    weeklyBreakdown,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/reports/weekly
// @access  Private
// ─────────────────────────────────────────
const getWeeklyReport = asyncHandler(async (req, res) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const dailyBreakdown = await Transaction.aggregate([
    {
      $match: {
        userId: req.user._id,
        type: "Expense",
        date: { $gte: start, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    dailyBreakdown,
  });
});

module.exports = { getMonthlyReport, getWeeklyReport };
