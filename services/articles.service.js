const BadRequestError = require("../errors/BadRequestError");
const InvalidTypeError = require("../errors/InvalidTypeError");
const NotFoundError = require("../errors/NotFoundError");
const {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  createCommentForArticle,
  updateVotesOfArticle,
} = require("../models/articles.model");
const {
  validateArticleId,
  validateUsername,
  validateArticleIdFormat,
} = require("./utils");

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
  await validateArticleId(article_id);

  const result = await fetchCommentsByArticleId(article_id);

  if (result === undefined) {
    throw new NotFoundError("No comments found!");
  } else {
    return result;
  }
};

exports.addCommentToArticle = async (article_id, username, body) => {
  await validateArticleId(article_id);
  await validateUsername(username);

  if (body.length > 500)
    throw new BadRequestError(
      "Comment is too long. It must be less than 500 characters!",
    );
  if (!body.length || body.length === 0)
    throw new BadRequestError("Comment is required!");
  const response = await createCommentForArticle(article_id, username, body);
  return response;
};

exports.incVotesByArticleId = async (article_id, body) => {
  validateArticleIdFormat(article_id);
  if (!Object.hasOwn(body, "inc_votes"))
    throw new BadRequestError("Invalid key!");
  if (!parseInt(body.inc_votes))
    throw new BadRequestError("Increment amount must be a number!");
  return await updateVotesOfArticle(article_id, body);
};
