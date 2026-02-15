const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");
const { fetchUserByUsername } = require("../models/users.model.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET: /api/users", () => {
  test("200: Responds with an array on the key of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeArray();
      });
  });
  test("200: Users array contains 4 users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
      });
  });
  test("200: Each user object has props: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user.username).toBeString();
          expect(user.name).toBeString();
          expect(user.avatar_url).toBeString();
        });
      });
  });
});

describe("Model testing: fetchUserByUsername()", () => {
  test("Should return an object if existing username was passed in", () => {
    return fetchUserByUsername("rogersop").then((res) => {
      expect(res).toBeObject();
    });
  });
  test("Should return undefined if existing username was passed in", () => {
    return fetchUserByUsername("asdf").then((res) => {
      expect(res).toBe(undefined);
    });
  });
});

describe("GET /api/users/:username", () => {
  test("200: /api/users/:username should be available", () => {
    return request(app).get("/api/users/icellusedkars").expect(200);
  });
  test("200: Should contain props under user key: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user.username).toBe("icellusedkars");
        expect(typeof user.name).toBeString();
        expect(typeof avatar_url).toBeString();
      });
  });
  test("404: Should return status 404 if user not found by provided username", () => {
    return request(app).get("/api/users/asdf").expect(404);
  });
});
