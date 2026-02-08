const app = require("express");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentToArticle,
  incVotesByArticleId,
} = require("../controllers/articles.controller");

const articlesRouter = app.Router();

articlesRouter.get("/", getAllArticles);
articlesRouter
  .route("/:articleId")
  .get(getArticleById)
  .patch(incVotesByArticleId);
articlesRouter
  .route("/:articleId/comments")
  .get(getCommentsByArticleId)
  .post(addCommentToArticle);

module.exports = articlesRouter;
