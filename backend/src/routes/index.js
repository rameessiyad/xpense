const router = require("express").Router();

const userRouter = require("./user-route");
const categoryRouter = require("./category-routes");
const transactionRouter = require("./transaction-route");
const budgetRouter = require("./budget-routes");
const reportRouter = require("./report-routes");

router.use("/auth", userRouter);
router.use("/category", categoryRouter);
router.use("/transaction", transactionRouter);
router.use("/budget", budgetRouter);
router.use("/report", reportRouter);

module.exports = router;
