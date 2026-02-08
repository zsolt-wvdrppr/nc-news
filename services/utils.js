const InvalidTypeError = require("../errors/InvalidTypeError");
const NotFoundError = require("../errors/NotFoundError");
const { fetchArticleById } = require("../models/articles.model");
const { fetchUserByUsername } = require("../models/users.model");

exports.validateArticleId = async (article_id) => {
  this.validateIdFormat(article_id, "article");
  const result = await fetchArticleById(article_id);
  if (result === undefined) throw new NotFoundError("Article not found");
};

exports.validateIdFormat = (id, id_type) => {
  if (!parseInt(id))
    throw new InvalidTypeError(`Incorrect ${id_type} id format!`);
};

exports.validateUsername = async (username) => {
  if ((await fetchUserByUsername(username)) === undefined)
    throw new NotFoundError("User not found!");
};
