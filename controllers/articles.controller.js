const BadRequestError = require("../errors/BadRequestError");
const {
  getAllArticles: getAllArticlesService,
  getArticleById: getARticleByIdService,
  getCommentsByArticleId: getCommentsByArticleIdService,
  addCommentToArticle: addCommentToArticleService,
  incVotesByArticleId: incVotesByArticleIdService,
  postNewArticle: postNewArticleService,
} = require("../services/articles.service");

const { validateRequestBody } = require("./utils");

exports.getAllArticles = async (req, res, next) => {
  const {
    sortBy = "created_at",
    order = "desc",
    topic = undefined,
  } = req.query;

  try {
    const articles = await getAllArticlesService(sortBy, order, topic);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
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
  validateRequestBody(reqBody);
  const { username, body } = reqBody;

  try {
    const comment = await addCommentToArticleService(articleId, username, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.incVotesByArticleId = async (req, res, next) => {
  const { articleId } = req.params;
  const body = req.body;
  validateRequestBody(body);

  try {
    const article = await incVotesByArticleIdService(articleId, body);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.postNewArticle = async (req, res, next) => {
  const reqBody = req.body;
  validateRequestBody(reqBody);

  const {
    author,
    title,
    body,
    topic,
    article_img_url = "placeholder.webp",
  } = reqBody;

  try {
    const article = await postNewArticleService(
      author,
      title,
      body,
      topic,
      article_img_url,
    );
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};
