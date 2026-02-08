const db = require("../db/connection");

exports.deleteCommentById = async (comment_id) => {
  const result = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *",
    [comment_id],
  );
  console.log("result+", result);
  return result.rows[0];
};
