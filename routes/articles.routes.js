const app = require("express");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentToArticle,
} = require("../controllers/articles.controller");

const articlesRouter = app.Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:articleId", getArticleById);
articlesRouter
  .route("/:articleId/comments")
  .get(getCommentsByArticleId)
  .post(addCommentToArticle);

module.exports = articlesRouter;
