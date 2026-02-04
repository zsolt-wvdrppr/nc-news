const app = require("express");
const { getAllArticles } = require("../controllers/articles.controller");

const articlesRouter = app.Router();

articlesRouter.get("/", getAllArticles);

module.exports = articlesRouter;
