const express = require("express");
const topicsRouter = require("./routes/topics.routes");
const articlesRouter = require("./routes/articles.routes");
const usersRouter = require("./routes/users.routes");
const commentsRouter = require("./routes/comments.routes");
const NotFoundError = require("./errors/NotFoundError");

const app = express();

app.use(express.json());

app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

app.all("*path", (req, res) => {
  const err = new NotFoundError("Path not found!");
  res.status(err.status).send({ message: err.message });
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).send({
      message: err.message,
    });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  // Handle all other errors
  res.status(500).send({
    message: err.message,
  });
});

module.exports = app;
