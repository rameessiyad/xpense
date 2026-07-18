const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    monthlyLimit: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    thresholds: {
      type: [Number],
      default: [75, 90, 100],
    },
    notifiedThresholds: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Budget", budgetSchema);
