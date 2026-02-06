const db = require("../db/connection");

exports.fetchAllArticles = async () => {
  const result = await db.query("SELECT * FROM articles;");
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
  return result.rows;
};
