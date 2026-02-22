const db = require("../db/connection");

exports.fetchAllTopics = async () => {
  const result = await db.query("SELECT * FROM topics;");
  return result.rows;
};

exports.fetchTopicBySlug = async (slug) => {
  const result = await db.query("SELECT * FROM topics WHERE slug = $1", [slug]);
  return result.rows[0];
};

exports.insertNewTopic = async (description, slug, img_url) => {
  const result = await db.query(
    `
    INSERT INTO topics (description, slug, img_url)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [description, slug, img_url],
  );

  return result.rows[0];
};
