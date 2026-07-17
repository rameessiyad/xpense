const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth-middleware");
const {
  getMonthlyReport,
  getWeeklyReport,
} = require("../controllers/report-controller");

router.use(protect);

router.get("/monthly", getMonthlyReport);
router.get("/weekly", getWeeklyReport);

module.exports = router;
