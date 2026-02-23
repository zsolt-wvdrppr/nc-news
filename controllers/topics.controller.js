const {
  getAllTopics: getAllTopicsService,
  postNewTopic: postNewTopicService,
} = require("../services/topics.service");
const { validateRequestBody } = require("./utils");

exports.getAllTopics = async (req, res) => {
  const topics = await getAllTopicsService();
  res.status(200).send({ topics });
};

exports.postNewTopic = async (req, res, next) => {
  const reqBody = req.body;
  validateRequestBody(reqBody);
  const { description, slug, img_url } = reqBody;

  try {
    const topic = await postNewTopicService(description, slug, img_url);
    res.status(201).send({ topic });
  } catch (err) {
    next(err);
  }
};
