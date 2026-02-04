const db = require("../db/connection");

exports.fetchAllTopics = async () => {
  const result = await db.query("SELECT * FROM topics;");
  return result.rows;
};
