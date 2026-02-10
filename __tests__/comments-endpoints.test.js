const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");
const { deleteCommentById } = require("../models/comments.model.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("Model testing: deletCommentById()", () => {
  test("Method should return deleted comment object", async () => {
    const comment_id = 1;
    const result = await deleteCommentById(comment_id);
    expect(result.comment_id).toBe(1);
    expect(result.article_id).toBe(9);
    expect(result.body).toBeString();
    expect(result.votes).toBeNumber();
    expect(result.author).toBeString();
    expect(typeof result.created_at).toBe("object");
  });
});

describe("DELETE /api/comments/:comment_id endpoint", () => {
  test("204: Endpoint available and return status 204 on successful deletion", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: Returns not found if comment does not exist in db", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Comment not found!");
      });
  });
  test("400: If the comment ID is invalid format, should return invalid type error", () => {
    return request(app)
      .delete("/api/comments/asdf")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Incorrect comment id format!");
      });
  });
  test("Database should not have the deleted comment", async () => {
    commentIdToDelete = 1;
    const queryResBefore = await db.query(
      "SELECT * FROM comments WHERE comment_id = $1",
      [commentIdToDelete],
    );
    const resultBefore = queryResBefore.rows[0];
    expect(resultBefore).not.toBe(undefined);
    return request(app)
      .delete(`/api/comments/${commentIdToDelete}`)
      .expect(204)
      .then(async () => {
        const queryResAfter = await db.query(
          "SELECT * FROM comments WHERE comment_id = $1",
          [commentIdToDelete],
        );
        const resultAfter = queryResAfter.rows[0];
        expect(resultAfter).toBe(undefined);
      });
  });
});
