const InvalidTypeError = require("../errors/InvalidTypeError");
const NotFoundError = require("../errors/NotFoundError");
const { fetchArticleById } = require("../models/articles.model");
const { fetchUserByUsername } = require("../models/users.model");
const { getArticleById } = require("./articles.service");

exports.validateArticleId = async (article_id) => {
  this.validateArticleIdFormat(article_id);
  const result = await fetchArticleById(article_id);
  if (result === undefined) throw new NotFoundError("Article not found");
};

exports.validateArticleIdFormat = (id) => {
  if (!parseInt(id)) throw new InvalidTypeError("Incorrect article id format!");
};

exports.validateUsername = async (username) => {
  if ((await fetchUserByUsername(username)) === undefined)
    throw new NotFoundError("User not found!");
};
