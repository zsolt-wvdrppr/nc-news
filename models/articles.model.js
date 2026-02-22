const db = require("../db/connection");
const format = require("pg-format");

exports.fetchAllArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic = null,
  limit = 10,
  p = 1,
) => {
  const query =
    topic ?
      format(
        "SELECT * FROM articles WHERE topic = %L ORDER BY %s %s",
        topic,
        sort_by,
        order,
      )
    : format("SELECT * FROM articles ORDER BY %s %s", sort_by, order);
  const totalCountQuery = await db.query(`SELECT COUNT(*) FROM articles`);
  const result = await db.query(format(query, sort_by, order));

  const totalCount = parseInt(totalCountQuery.rows[0].count);

  return {
    articles: result.rows,
    total_count: totalCount,
  };
};

exports.fetchArticleById = async (article_id) => {
  const result = await db.query(
    `SELECT
    COUNT(comment_id) AS comment_count,
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.body,
    articles.created_at,
    articles.votes,
    articles.article_img_url
FROM
    articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
WHERE
    articles.article_id = $1
GROUP BY
    articles.article_id;`,
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

exports.insertArticle = async (
  author,
  title,
  body,
  topic,
  article_img_url = "placeholder.webp",
) => {
  const result = await db.query(
    `INSERT INTO articles (author, title, body, topic, article_img_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *
    `,
    [author, title, body, topic, article_img_url],
  );

  return result.rows[0];
};
