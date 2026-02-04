const db = require("../db/connection");

const fetchAllTopics = async () => {
  const result = await db.query("SELECT * FROM topics");
  return result.rows;
};

module.exports = fetchAllTopics;
