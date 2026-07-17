const router = require("express").Router();

const userRouter = require("./user-route");
const categoryRouter = require("./category-routes");
const transactionRouter = require("./transaction-route");

router.use("/auth", userRouter);
router.use("/category", categoryRouter);
router.use("/transaction", transactionRouter);

module.exports = router;
