const router = require("express").Router();

const userRouter = require("./user-route");

router.use("/auth", userRouter);

module.exports = router;
