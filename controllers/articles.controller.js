const {
  getAllArticles: getAllArticlesService,
  getArticleById: getARticleByIdService,
} = require("../services/articles.service");

exports.getAllArticles = async (req, res) => {
  const articles = await getAllArticlesService();
  res.status(200).send({ articles });
};

exports.getArticleById = async (req, res) => {
  const { articleId } = req.params;
  const article = await getARticleByIdService(articleId);
  res.status(200).send({ article });
};
