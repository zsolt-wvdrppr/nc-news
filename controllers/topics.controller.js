const {
  getAllTopics: getAllTopicsService,
} = require("../services/topics.service");

exports.getAllTopics = async (req, res) => {
  const topics = await getAllTopicsService();
  res.status(200).send({ topics });
};
