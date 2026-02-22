const db = require("../db/connection");

exports.fetchAllUsers = async () => {
  const result = await db.query("SELECT * FROM users;");
  return result.rows;
};

exports.fetchUserByUsername = async (username) => {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

exports.insertNewUser = async (username, name, avatar_url) => {
  const result = await db.query(
    `
    INSERT INTO users (username, name, avatar_url)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [username, name, avatar_url],
  );

  return result.rows[0];
};
