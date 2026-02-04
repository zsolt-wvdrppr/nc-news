const express = require("express");
const topicsRouter = require("./routes/topics.routes");
const articlesRouter = require("./routes/articles.routes");
const usersRouter = require("./routes/users.routes");

const app = express();

app.use(express.json());

app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);

module.exports = app;
