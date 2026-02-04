const app = require("express");
const { getAllTopics } = require("../controllers/topics.controller");

const topicsRouter = app.Router();

topicsRouter.get("/", getAllTopics);

module.exports = topicsRouter;
