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

describe("GET: /api/topics", () => {
  test("200: Responds with an array on the key of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeArray();
      });
  });
  test("200: Topics array contains 3 topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
      });
  });
  test("200: Each article object has props: description, slug, img_url", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((article) => {
          expect(article.description).toBeString();
          expect(article.slug).toBeString();
          expect(article.img_url).toBeString();
        });
      });
  });
});

/*describe("GET /api/topics/:topics_id", () => {
  test("200: Should be available on /api/topics/:article_id", () => {
    return request(app).get("/api/topics/1").expect(200);
  });
  test("200: Should return an object under the key article", () => {
    return request(app)
      .get("/api/topics/1")
      .expect(200)
      .then((res) => {
        const { article } = res.body;
        expect(article).toBeObject();
      });
  });
  test("200: A returned article object should have props: article_id, title, topic, author, body, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/topics/1")
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
    return request(app).get("/api/topics/100").expect(404);
  });
});*/
