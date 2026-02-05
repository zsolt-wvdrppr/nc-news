const app = require("express");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
} = require("../controllers/articles.controller");

const articlesRouter = app.Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:articleId", getArticleById);
articlesRouter.get("/:articleId/comments", getCommentsByArticleId);

module.exports = articlesRouter;
