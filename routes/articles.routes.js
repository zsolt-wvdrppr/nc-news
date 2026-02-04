const app = require("express");
const {
  getAllArticles,
  getArticleById,
} = require("../controllers/articles.controller");

const articlesRouter = app.Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:articleId", getArticleById);

module.exports = articlesRouter;
