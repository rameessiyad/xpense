const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth-middleware");
const {
  getTodayTransactions,
  getMonthToDate,
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction-controller");

router.use(protect);

router.get("/today", getTodayTransactions);
router.get("/month-to-date", getMonthToDate);
router.get("/", getTransactions);
router.get("/:id", getTransaction);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
