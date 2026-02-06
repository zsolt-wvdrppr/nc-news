const BadRequestError = require("../errors/BadRequestError");
const InvalidTypeError = require("../errors/InvalidTypeError");
const NotFoundError = require("../errors/NotFoundError");
const ServerError = require("../errors/ServerError");
const {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  createCommentForArticle,
} = require("../models/articles.model");
const { fetchUserByUsername } = require("../models/users.model");

const isIdValid = (id) => (parseInt(id) >= 0 ? true : false);

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

const doesUserExist = async (username) => {
  return (await fetchUserByUsername(username)) !== undefined;
};

exports.addCommentToArticle = async (article_id, username, body) => {
  if (!isIdValid(article_id)) throw new InvalidTypeError("Invalid article id!");

  const hasUser = await doesUserExist(username);
  if (!hasUser) throw new NotFoundError("User not found!");
  if (body.length > 500)
    throw new BadRequestError(
      "Comment is too long. It must be less than 500 characters!",
    );
  if (!body.length || body.length === 0)
    throw new BadRequestError("Comment is required!");
  const response = await createCommentForArticle(article_id, username, body);
  return response;
};
