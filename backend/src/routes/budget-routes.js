const express = require("express");
const { protect } = require("../middleware/auth-middleware");
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} = require("../controllers/budget-controller");
const router = express.Router();

router.use(protect);

router.get("/", getBudgets);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
