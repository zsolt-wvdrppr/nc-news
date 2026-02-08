const db = require("../db/connection");
const format = require("pg-format");

exports.fetchAllArticles = async (sort_by = "created_at", order = "desc") => {
  console.log("fetchAllArticles triggered");
  const result = await db.query(
    format("SELECT * FROM articles ORDER BY %s %s", sort_by, order),
  );
  console.log("resultmod+", result);
  return result.rows;
};

exports.fetchArticleById = async (article_id) => {
  const result = await db.query(
    "SELECT * FROM articles WHERE article_id = $1",
    [article_id],
  );
  return result.rows[0];
};

exports.fetchCommentsByArticleId = async (article_id) => {
  const result = await db.query(
    "SELECT * FROM comments WHERE article_id = $1",
    [article_id],
  );
  return result.rows;
};

exports.createCommentForArticle = async (article_id, username, body) => {
  const result = await db.query(
    `INSERT INTO comments (article_id, body, author)
    VALUES ($1, $2, $3) RETURNING *`,
    [article_id, body, username],
  );
  return result.rows[0];
};

exports.updateVotesOfArticle = async (article_id, body) => {
  const result = await db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
    [body.inc_votes, article_id],
  );
  return result.rows[0];
};
