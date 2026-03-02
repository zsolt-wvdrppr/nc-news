const BadRequestError = require("../errors/BadRequestError");
const {
  removeCommentById: removeCommentByIdService,
  updateVotesByCommentId: updateVotesByCommentIdService,
} = require("../services/comments.service");

exports.removeCommentById = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    await removeCommentByIdService(commentId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.updateVotesByCommentId = async (req, res, next) => {
  const { commentId } = req.params;
  const { body } = req;

  if (!body) throw new BadRequestError("Missing request body!");

  try {
    const comment = await updateVotesByCommentIdService(commentId, body);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
