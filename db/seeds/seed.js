const db = require("../connection");
const { getTableDataInsertionQuery, findPropWhereMatches } = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  console.log("seed function invoked");
  // DROP TABLES IF EXIST
  await db.query(`
    DROP TABLE IF EXISTS emoji_article_user;
    `);
  await db.query(`
    DROP TABLE IF EXISTS emojis;
    `);
  await db.query(`
    DROP TABLE IF EXISTS comments;
    `);
  await db.query(`
    DROP TABLE IF EXISTS articles;
    `);
  await db.query(`
    DROP TABLE IF EXISTS users;
    `);
  await db.query(`
    DROP TABLE IF EXISTS topics;
    `);

  // CREATE TABLES
  // Create topics table
  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY,
      description VARCHAR NOT NULL,
      img_url VARCHAR(1000) DEFAULT 'placeholder.jpg'
    );
    `);
  // Create users table
  await db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY NOT NULL,
      name VARCHAR NOT NULL,
      avatar_url VARCHAR(1000) DEFAULT 'placeholder.jpg'
    );
    `);
  // Create articles table
  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      topic VARCHAR NOT NULL REFERENCES topics(slug) ON DELETE CASCADE,
      author VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000) DEFAULT 'placeholder.jpg'
    );
    `);

  // Create comments table
  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT NOT NULL REFERENCES articles(article_id),
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR NOT NULL REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);
  // INSERT DATA
  // Insert topics data
  await db.query(getTableDataInsertionQuery("topics", topicData));
  // Insert users data
  await db.query(getTableDataInsertionQuery("users", userData));
  // Insert articles data
  const articles = await db.query(
    getTableDataInsertionQuery("articles", articleData, [
      "article_id",
      "title",
    ]),
  );

  const extendedCommentsData = commentData.map((obj) => {
    const id = findPropWhereMatches(
      "article_id",
      "title",
      obj.article_title,
      articles.rows,
    );

    const newObj = Object.assign({
      article_id: id,
      ...obj,
    });

    delete newObj["article_title"];

    return newObj;
  });

  // Insert comments data
  await db.query(getTableDataInsertionQuery("comments", extendedCommentsData));

  // Create emoji table
  await db.query(`
    CREATE TABLE emojis (
      emoji_id SERIAL PRIMARY KEY,
      emoji VARCHAR NOT NULL
    )
    `);

  // Create emoji_article_user table
  await db.query(`
    CREATE TABLE emoji_article_user (
      emoji_article_user_id SERIAL PRIMARY KEY,
      emoji_id INT REFERENCES emojis(emoji_id),
      username VARCHAR REFERENCES users(username),
      article_id INT REFERENCES articles(article_id)
    )
    `);
};
module.exports = seed;
