const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");
const { createCommentForArticle } = require("../models/articles.model.js");
const NotFoundError = require("../errors/NotFoundError.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET: /api/articles", () => {
  test("200: Responds with an array on the key of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeArray();
      });
  });
  test("200: Articles array contains 13 articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
      });
  });
  test("200: Each article object has props: title, topic, author, body, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.title).toBeString();
          expect(article.topic).toBeString();
          expect(article.author).toBeString();
          expect(article.body).toBeString();
          expect(article.created_at).toBeString();
          expect(article.votes).toBeNumber();
          expect(article.article_img_url).toBeString();
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Should be available on /api/articles/:article_id", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("200: Should return an object under the key article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        expect(article).toBeObject();
      });
  });
  test("200: A returned article object should have props: article_id, title, topic, author, body, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .expect("content-type", /application\/json/)
      .then((res) => {
        const { article } = res.body;
        expect(article.article_id).toBe(1);
        expect(article.title).toBeString();
        expect(article.topic).toBeString();
        expect(article.author).toBeString();
        expect(article.body).toBeString();
        expect(article.created_at).toBeString();
        expect(article.votes).toBeNumber();
        expect(article.article_img_url).toBeString();
      });
  });
  test("404: Should return 404 Not Found if id not found", () => {
    return request(app).get("/api/articles/100").expect(404);
  });
  test("400: Should return 404 Invalid Type Error if not number passed as id", () => {
    return request(app).get("/api/articles/asdf").expect(400);
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("200: Responds with an array on the key of articles", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeArray();
      });
  });
  test("200: Comments array contains 11 comments (of article id=1)", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
      });
  });
  test("200: Each article object has props: article_id, body, votes, author, created_at", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment.body).toBeString();
          expect(comment.votes).toBeNumber();
          expect(comment.author).toBeString();
          expect(comment.created_at).toBeString();
        });
      });
  });
});

describe("Model testing: createCommentForArticle()", () => {
  test("The model return an array", () => {
    return createCommentForArticle(
      1,
      "butter_bridge",
      "it's a test comment",
    ).then((res) => {
      expect(res).toBeObject();
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with an object", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(201)
      .then((res) => {
        expect(res).toBeObject();
      });
  });
  test("201: The returned object should have props: comment_id, article_id, body, votes, author, created_at", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBeNumber();
        expect(comment.article_id).toBe(1);
        expect(comment.votes).toBeNumber();
        expect(comment.author).toBeString();
        expect(comment.created_at).toBeString();
      });
  });
  test("201: The added comment should exist in the database", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(201)
      .then(async ({ body: { comment } }) => {
        const queryResult = await db.query(
          `SELECT * FROM comments WHERE comment_id = $1`,
          [comment.comment_id],
        );
        const commentObj = queryResult.rows[0];
        console.log("typeof created_at", typeof commentObj.created_at);
        expect(queryResult.rows).toBeArray();
        expect(commentObj).toBeObject();
        expect(commentObj.comment_id).toBeNumber();
        expect(commentObj.article_id).toBe(1);
        expect(commentObj.votes).toBeNumber();
        expect(commentObj.author).toBeString();
        expect(typeof commentObj.created_at).toBe("object");
      });
  });
  test("404: If the name does not exist in the database, should return Not Found error", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "non_existing_user",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("User not found!");
      });
  });
  test("400: If the article ID is invalid format, should return Invalid Type error", () => {
    return request(app)
      .post("/api/articles/invalidID/comments")
      .send({
        username: "non_existing_user",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid article id!");
      });
  });
  test("500: If the comment body has 0 character should return Bad request error", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(400)
      .then(({ body }) => {
        console.log("res+", body);
        expect(body.message).toBe("Comment is required!");
      });
  });
  test("500: If the comment body has more than 500 character should return Bad request error", () => {
    const genContent = (len) => {
      let content = "";
      for (let i = 0; i < len; i++) {
        content += "a";
      }
      return content;
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: genContent(501),
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(400)
      .then(({ body }) => {
        console.log("res+", body);
        expect(body.message).toBe(
          "Comment is too long. It must be less than 500 characters!",
        );
      });
  });
});
