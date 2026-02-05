const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");

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
