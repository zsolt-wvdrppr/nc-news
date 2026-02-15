const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const {
  deleteCommentById,
  updateCommentVoteByCommentId,
} = require("../models/comments.model");
const { validateIdFormat } = require("./utils");

exports.removeCommentById = async (comment_id) => {
  validateIdFormat(comment_id, "comment");
  const result = await deleteCommentById(comment_id);
  if (result === undefined) throw new NotFoundError("Comment not found!");
  return;
};

exports.updateVotesByCommentId = async (comment_id, body) => {
  validateIdFormat(comment_id, "comment");
  const { inc_votes } = body;
  if (!inc_votes || !Number(inc_votes))
    throw new BadRequestError("Increment amount must be provided as a number!");

  const result = await updateCommentVoteByCommentId(comment_id, inc_votes);
  if (result === undefined) throw new NotFoundError("Comment not found!");
  return result;
};
