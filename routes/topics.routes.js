const app = require("express");
const {
  getAllTopics,
  postNewTopic,
} = require("../controllers/topics.controller");

const topicsRouter = app.Router();

topicsRouter.route("/").get(getAllTopics).post(postNewTopic);

module.exports = topicsRouter;
