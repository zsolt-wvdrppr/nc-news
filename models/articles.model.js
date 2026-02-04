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

  if (result.rows.length === 0) {
    return { status: 404, msg: "Article not found!" };
  }

  return result.rows[0];
};
