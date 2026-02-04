const {
  getAllArticles: getAllArticlesService,
} = require("../services/articles.service");

exports.getAllArticles = async (req, res) => {
  const articles = await getAllArticlesService();
  res.status(200).send({ articles });
};
