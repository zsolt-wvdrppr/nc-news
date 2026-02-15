const BadRequestError = require("../errors/BadRequestError");
const InvalidTypeError = require("../errors/InvalidTypeError");
const NotFoundError = require("../errors/NotFoundError");
const { fetchArticleById } = require("../models/articles.model");
const { fetchTopicBySlug } = require("../models/topics.model");
const { fetchUserByUsername } = require("../models/users.model");

exports.validateArticleId = async (article_id) => {
  this.validateIdFormat(article_id, "article");
  const result = await fetchArticleById(article_id);
  if (result === undefined) throw new NotFoundError("Article not found");
};

exports.validateIdFormat = (id, id_type = "") => {
  if (id_type) id_type += " "; // Add space character after id type if availabe
  if (!Number(id)) throw new InvalidTypeError(`Incorrect ${id_type}id format!`);
};

exports.validateUsername = async (username) => {
  if ((await fetchUserByUsername(username)) === undefined)
    throw new NotFoundError("User not found!");
};

exports.validateArticleSortByColumnName = (sort_by) => {
  const whitelist = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
  ];
  if (!whitelist.includes(sort_by))
    throw new BadRequestError(`Sorting by ${sort_by} isn't allowed!`);
};

exports.validateOrder = (order) => {
  const whitelist = ["asc", "desc"];
  if (!whitelist.includes(order))
    throw new BadRequestError(`Order "${order}" is invalid!`);
};

exports.validateTopicSlug = async (slug) => {
  if ((await fetchTopicBySlug(slug)) === undefined)
    throw new NotFoundError("Topic not found!");
};
