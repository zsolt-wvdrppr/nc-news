const {
  removeCommentById: removeCommentByIdService,
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
