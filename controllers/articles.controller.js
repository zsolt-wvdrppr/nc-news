const {
  getAllArticles: getAllArticlesService,
  getArticleById: getARticleByIdService,
  getCommentsByArticleId: getCommentsByArticleIdService,
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
