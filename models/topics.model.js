const db = require("../db/connection");

exports.fetchAllTopics = async () => {
  const result = await db.query("SELECT * FROM topics;");
  return result.rows;
};

exports.fetchTopicBySlug = async (slug) => {
  const result = await db.query("SELECT * FROM topics WHERE slug = $1", [slug]);
  return result.rows[0];
};
