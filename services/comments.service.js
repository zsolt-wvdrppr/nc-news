const BadRequestError = require("../errors/BadRequestError");
const InvalidTypeError = require("../errors/InvalidTypeError");
const NotFoundError = require("../errors/NotFoundError");
const { deleteCommentById } = require("../models/comments.model");
const { validateIdFormat } = require("./utils");

exports.removeCommentById = async (comment_id) => {
  validateIdFormat(comment_id, "comment");
  const result = await deleteCommentById(comment_id);
  if (result === undefined) throw new NotFoundError("Comment not found!");
  return;
};
