const commentsRouter = require("express").Router();
const { removeCommentById } = require("../controllers/comments.controller");

commentsRouter.delete("/:commentId", removeCommentById);

module.exports = commentsRouter;
