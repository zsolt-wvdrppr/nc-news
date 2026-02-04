const express = require("express");
const topicsRouter = require("./routes/topics.routes");

const app = express();

app.use(express.json());

app.use("/api/topics", topicsRouter);

module.exports = app;
