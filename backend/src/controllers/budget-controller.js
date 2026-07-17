const Budget = require('../models/budget-model');
const Transaction = require('../models/transaction-model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// ─────────────────────────────────────────
// @route   GET /api/v1/budgets
// @access  Private
// ─────────────────────────────────────────
const getBudgets = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = String(now.getMonth() + 1);
  const year = now.getFullYear();

  const budgets = await Budget.find({
    userId: req.user.id,
    month,
    year,
  }).populate('categoryId', 'name icon group');

  // for each budget calculate spent amount
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const startOfMonth = new Date(year, now.getMonth(), 1);
      const matchFilter = {
        userId: budget.userId,
        type: 'Expense',
        date: { $gte: startOfMonth, $lte: now },
      };
      if (budget.categoryId) {
        matchFilter.categoryId = budget.categoryId;
      }

      const result = await Transaction.aggregate([
        { $match: matchFilter },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      const spent = result[0]?.total || 0;
      const remaining = budget.monthlyLimit - spent;
      const percentage = Math.round((spent / budget.monthlyLimit) * 100);

      return {
        ...budget.toObject(),
        spent,
        remaining,
        percentage,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: budgetsWithSpent,
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/budgets
// @access  Private
// ─────────────────────────────────────────
const createBudget = asyncHandler(async (req, res) => {
  const { categoryId, monthlyLimit, month, year, thresholds } = req.body;

  if (!monthlyLimit) {
    throw new AppError('Monthly limit is required', 400);
  }

  const now = new Date();
  const budgetMonth = month || String(now.getMonth() + 1);
  const budgetYear  = year  || now.getFullYear();

  // check if budget already exists for this month
  const existing = await Budget.findOne({
    userId: req.user.id,
    categoryId: categoryId || null,
    month: budgetMonth,
    year: budgetYear,
  });

  if (existing) {
    throw new AppError('Budget already exists for this month. Use update instead.', 400);
  }

  const budget = await Budget.create({
    userId: req.user.id,
    categoryId: categoryId || null,
    monthlyLimit,
    month: budgetMonth,
    year: budgetYear,
    thresholds: thresholds || [75, 90, 100],
    notifiedThresholds: [],
  });

  res.status(201).json({
    success: true,
    message: 'Budget created successfully',
    data: budget,
  });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/budgets/:id
// @access  Private
// ─────────────────────────────────────────
const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) throw new AppError('Budget not found', 404);

  if (budget.userId.toString() !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  const updated = await Budget.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      notifiedThresholds: [], // reset notifications on limit change
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Budget updated successfully',
    data: updated,
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/budgets/:id
// @access  Private
// ─────────────────────────────────────────
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) throw new AppError('Budget not found', 404);

  if (budget.userId.toString() !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  await budget.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Budget deleted successfully',
  });
});

module.exports = { getBudgets, createBudget, updateBudget, deleteBudget };