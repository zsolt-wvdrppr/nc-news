const app = require("express");
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentToArticle,
  incVotesByArticleId,
  postNewArticle,
} = require("../controllers/articles.controller");

const articlesRouter = app.Router();

articlesRouter.route("/").get(getAllArticles).post(postNewArticle);
articlesRouter
  .route("/:articleId")
  .get(getArticleById)
  .patch(incVotesByArticleId);
articlesRouter
  .route("/:articleId/comments")
  .get(getCommentsByArticleId)
  .post(addCommentToArticle);

module.exports = articlesRouter;
