const InvalidTypeError = require("../errors/InvalidTypeError");
const NotFoundError = require("../errors/NotFoundError");
const {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
} = require("../models/articles.model");

exports.getAllArticles = () => {
  return fetchAllArticles();
};

exports.getArticleById = async (article_id) => {
  if (!parseInt(article_id))
    throw new InvalidTypeError("Incorrect article id format!");

  const result = await fetchArticleById(article_id);

  if (result === undefined) {
    throw new NotFoundError("Article not found");
  } else {
    return result;
  }
};

exports.getCommentsByArticleId = async (article_id) => {
  if (!parseInt(article_id))
    throw new InvalidTypeError("Incorrect article id format!");

  const result = await fetchCommentsByArticleId(article_id);

  if (result === undefined) {
    throw new NotFoundError("No comments found!");
  } else {
    return result;
  }
};
