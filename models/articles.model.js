const db = require("../db/connection");

exports.fetchAllArticles = async () => {
  const result = await db.query("SELECT * FROM articles;");
  return result.rows;
};
