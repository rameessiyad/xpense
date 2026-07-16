const router = require("express").Router();

const userRouter = require("./user-route");
const categoryRouter = require("./category-routes");

router.use("/auth", userRouter);
router.use("/category", categoryRouter);

module.exports = router;
