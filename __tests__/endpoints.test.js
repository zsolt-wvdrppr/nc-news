const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../app.js");

describe("GET: /", () => {
  test("404: Responds with Not Found error", () => {
    return request(app).get("/").expect(404);
  });
});
