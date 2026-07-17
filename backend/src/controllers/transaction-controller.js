const Transaction = require("../models/transaction-model");
const Budget = require("../models/budget-model");
const asyncHandler = require("../utils/asynchandler");
const AppError = require("../utils/appError");

// ─────────────────────────────────────────
// helper — check budget threshold after
// every new transaction and notify
// ─────────────────────────────────────────
const checkBudgetThreshold = async (userId) => {
  const now = new Date();
  const month = String(now.getMonth() + 1);
  const year = now.getFullYear();

  //get overall monthly budget
  const budget = await Budget.findOne({
    userId,
    categoryId: null,
    month,
    year,
  });
  if (!budget) return;

  //sum all expenses this month
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const result = await Transaction.aggregate([
    {
      $match: {
        userId: budget.userId,
        type: "Expense",
        date: { $gte: startOfMonth, $lte: now },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalSpent = result[0]?.total || 0;
  const percentage = (totalSpent / budget.monthlyLimit) * 100;
  const remaining = budget.monthlyLimit - totalSpent;

  // check which thresholds are newly crossed
  for (const threshold of budget.thresholds) {
    if (
      percentage >= threshold &&
      !budget.notifiedThresholds.includes(threshold)
    ) {
      // mark threshold as notified
      budget.notifiedThresholds.push(threshold);
      await budget.save();

      // TODO: send push notification here via Expo Notifications / FCM
      console.log(
        `🔔 Notification: Only ₹${remaining.toFixed(0)} left to reach your monthly limit`,
      );
    }
  }
};

// ─────────────────────────────────────────
// @route   GET /api/v1/transactions
// @access  Private
// ─────────────────────────────────────────
const getTransactions = asyncHandler(async (req, res) => {
  const {
    type,
    categoryId,
    startDate,
    endDate,
    limit = 20,
    page = 1,
  } = req.query;

  const filter = { userId: req.user.id };

  if (type) filter.type = type;
  if (categoryId) filter.categoryId = categoryId;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("categoryId", "name icon group color")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Transaction.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: transactions.length,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: transactions,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/transactions/today
// @access  Private
// ─────────────────────────────────────────
const getTodayTransactions = asyncHandler(async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const transactions = await Transaction.find({
    userId: req.user.id,
    date: { $gte: start, $lte: end },
  })
    .populate("categoryId", "name icon group")
    .sort({ date: -1 });

  const todayTotal = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  res.status(200).json({
    success: true,
    todayTotal,
    count: transactions.length,
    data: transactions,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/transactions/month-to-date
// @access  Private
// ─────────────────────────────────────────
const getMonthToDate = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const transactions = await Transaction.find({
    userId: req.user.id,
    type: "Expense",
    date: { $gte: startOfMonth, $lte: now },
  })
    .populate("categoryId", "name icon group")
    .sort({ date: -1 });

  // group by day
  const dayMap = {};
  transactions.forEach((t) => {
    const day = new Date(t.date).toISOString().split("T")[0];
    dayMap[day] = (dayMap[day] || 0) + t.amount;
  });

  const dailyBreakdown = Object.entries(dayMap)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const monthTotal = transactions.reduce((sum, t) => sum + t.amount, 0);

  res.status(200).json({
    success: true,
    monthTotal,
    dailyBreakdown,
    data: transactions,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/transactions/:id
// @access  Private
// ─────────────────────────────────────────
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).populate(
    "categoryId",
    "name icon group",
  );

  if (!transaction) throw new AppError("Transaction not found", 404);

  if (transaction.userId.toString() !== req.user.id) {
    throw new AppError("Not authorized", 403);
  }

  res.status(200).json({ success: true, data: transaction });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/transactions
// @access  Private
// ─────────────────────────────────────────
const createTransaction = asyncHandler(async (req, res) => {
  const { categoryId, amount, type, note, date } = req.body;

  if (!categoryId || !amount || !type) {
    throw new AppError("Category, amount and type are required", 400);
  }

  if (amount <= 0) {
    throw new AppError("Amount must be greater than 0", 400);
  }

  const transaction = await Transaction.create({
    userId: req.user.id,
    categoryId,
    amount,
    type,
    note,
    date: date || new Date(),
  });

  await transaction.populate("categoryId", "name icon group");

  // check budget threshold after every expense
  if (type === "Expense") {
    await checkBudgetThreshold(req.user.id);
  }

  res.status(201).json({
    success: true,
    message: "Transaction added successfully",
    data: transaction,
  });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/transactions/:id
// @access  Private
// ─────────────────────────────────────────
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) throw new AppError("Transaction not found", 404);

  if (transaction.userId.toString() !== req.user.id) {
    throw new AppError("Not authorized", 403);
  }

  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("categoryId", "name icon group");

  res.status(200).json({
    success: true,
    message: "Transaction updated successfully",
    data: updated,
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/transactions/:id
// @access  Private
// ─────────────────────────────────────────
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) throw new AppError("Transaction not found", 404);

  if (transaction.userId.toString() !== req.user.id) {
    throw new AppError("Not authorized", 403);
  }

  await transaction.deleteOne();

  res.status(200).json({
    success: true,
    message: "Transaction deleted successfully",
  });
});

module.exports = {
  getTransactions,
  getTodayTransactions,
  getMonthToDate,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
