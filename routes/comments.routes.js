const commentsRouter = require("express").Router();
const {
  removeCommentById,
  updateVotesByCommentId,
} = require("../controllers/comments.controller");

commentsRouter.delete("/:commentId", removeCommentById);
commentsRouter.patch("/:commentId", updateVotesByCommentId);

module.exports = commentsRouter;
