const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");

const generateText = (len = 3) => {
  let output = "";
  for (let i = 0; i < len; i++) {
    output += "a";
  }
  return output;
};

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

describe("POST /api/topics", () => {
  test("201: Should be available on /api/topics", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "plants",
        description: "This topic has everything that involves plants",
      })
      .expect(201);
  });
  test("201: Should return a topic object containing the newly added topic", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "plants",
        description: "This topic has everything that involves plants",
      })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toBeObject();
        expect(topic.description).toBeString();
        expect(topic.slug).toBe("plants");
        expect(topic.img_url).toBe("placeholder.webp");
      });
  });
  test("400: Should return bad request error if either description or title missing", () => {
    return request(app)
      .post("/api/topics")
      .send({
        description: "This topic has everything that involves plants",
      })
      .expect(400);
  });
  test("400: Should return bad request error if description longer than 255 chars", () => {
    const desc = generateText(256);

    return request(app)
      .post("/api/topics")
      .send({
        slug: "asdf",
        description: desc,
      })
      .expect(400);
  });
  test("400: Should return bad request error if slug longer than 55 chars", () => {
    const slug = generateText(56);

    return request(app)
      .post("/api/topics")
      .send({
        slug: slug,
        description: "Description",
      })
      .expect(400);
  });
});
