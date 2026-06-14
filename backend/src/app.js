const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/error-middleware");
const indexRouter = require("./routes/index");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", indexRouter);
app.use(errorHandler);

module.exports = app;
