const BadRequestError = require("../errors/BadRequestError");
const { createCommentForArticle } = require("../models/articles.model");
const {
  getAllArticles: getAllArticlesService,
  getArticleById: getARticleByIdService,
  getCommentsByArticleId: getCommentsByArticleIdService,
  addCommentToArticle: addCommentToArticleService,
} = require("../services/articles.service");

exports.getAllArticles = async (req, res) => {
  const articles = await getAllArticlesService();
  res.status(200).send({ articles });
};

exports.getArticleById = async (req, res, next) => {
  const { articleId } = req.params;

  try {
    const article = await getARticleByIdService(articleId);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  const { articleId } = req.params;
  try {
    const comments = await getCommentsByArticleIdService(articleId);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.addCommentToArticle = async (req, res, next) => {
  const { articleId } = req.params;
  const reqBody = req.body;
  if (reqBody === undefined) throw new BadRequestError("Missing request body!");
  const { username, body } = reqBody;

  try {
    const comment = await addCommentToArticleService(articleId, username, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
