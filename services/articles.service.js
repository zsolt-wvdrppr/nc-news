const InvalidTypeError = require("../errors/InvalidTypeError");
const NotFoundError = require("../errors/NotFoundError");
const {
  fetchAllArticles,
  fetchArticleById,
} = require("../models/articles.model");

exports.getAllArticles = () => {
  return fetchAllArticles();
};

exports.getArticleById = async (article_id) => {
  if (!parseInt(article_id)) throw new InvalidTypeError("Invalid ID type!");

  const result = await fetchArticleById(article_id);

  if (result === undefined) {
    throw new NotFoundError("Article not found");
  } else {
    return result;
  }
};
