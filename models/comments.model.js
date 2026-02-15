const db = require("../db/connection");

exports.deleteCommentById = async (comment_id) => {
  const result = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *",
    [comment_id],
  );
  return result.rows[0];
};

exports.fetchCommentById = async (comment_id) => {
  const result = await db.query(
    "SELECT * FROM comments WHERE comment_id = $1",
    [comment_id],
  );
  return result.rows[0];
};

exports.updateCommentVoteByCommentId = async (comment_id, inc_votes = 0) => {
  const result = await db.query(
    "UPDATE comments SET votes = votes + $2 where comment_id = $1 RETURNING *",
    [comment_id, inc_votes],
  );

  return result.rows[0];
};
