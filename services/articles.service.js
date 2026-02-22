const BadRequestError = require("../errors/BadRequestError");
const InvalidTypeError = require("../errors/InvalidTypeError");
const NotFoundError = require("../errors/NotFoundError");
const ServerError = require("../errors/ServerError");
const {
  fetchAllArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  createCommentForArticle,
  updateVotesOfArticle,
  insertArticle,
} = require("../models/articles.model");
const {
  validateArticleId,
  validateUsername,
  validateIdFormat,
  validateArticleSortByColumnName,
  validateOrder,
  validateTopicSlug,
} = require("./utils");

exports.getAllArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic = undefined,
  limit = 10,
  p = 1,
) => {
  if (topic) await validateTopicSlug(topic);
  validateArticleSortByColumnName(sort_by);
  validateOrder(order);
  const result = await fetchAllArticles(sort_by, order, topic, limit, p);
  if (result.total_count && result.articles.length === 0)
    throw new NotFoundError(`Requested page (${p}) exceded page count!`);
  return result;
};

exports.getArticleById = async (article_id) => {
  await validateArticleId(article_id);
  return await fetchArticleById(article_id);
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
  validateIdFormat(article_id, "article");
  if (!Object.hasOwn(body, "inc_votes"))
    throw new BadRequestError("Invalid key!");
  if (!parseInt(body.inc_votes))
    throw new BadRequestError("Increment amount must be a number!");
  return await updateVotesOfArticle(article_id, body);
};

exports.postNewArticle = async (
  author,
  title,
  body,
  topic,
  article_img_url = "placeholder.webp",
) => {
  // check if artist exist
  await validateUsername(author);

  // check if topic exist
  await validateTopicSlug(topic);

  // check rest of values validity
  if (!title) throw new BadRequestError("Title is required!");
  if (title.length > 255)
    throw new BadRequestError("Title must be no more than 255 characters!");
  if (!body) throw new BadRequestError("Body is required!");
  if (body.length > 600)
    throw new BadRequestError("Body must be no more than 600 characters!");

  const newArticle = await insertArticle(
    author,
    title,
    body,
    topic,
    article_img_url,
  );
  if (newArticle === undefined)
    throw new ServerError("Article insertion has failed!");
  const newArticleId = newArticle.article_id;

  return fetchArticleById(newArticleId);
};
