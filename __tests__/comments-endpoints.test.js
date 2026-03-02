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

describe("PATCH /api/comments/:comment_id update vote", () => {
  test("200: Should return an object", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(typeof comment).toBe("object");
      });
  });
  test("200: Should return an object with following props under comment key: comment_id, article_id, body, votes, author, created_at", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.article_id).toBe("number");
        expect(typeof comment.body).toBe("string");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.author).toBe("string");
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("200: Should be updated in database", async () => {
    // Get original votes
    const beforeQuery = await db.query(
      "SELECT votes FROM comments WHERE comment_id = $1;",
      [1],
    );
    const votesBefore = beforeQuery.rows[0].votes;

    // Make the request
    await request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200);

    // Check database AFTER request completes
    const afterQuery = await db.query(
      "SELECT votes FROM comments WHERE comment_id = $1;",
      [1],
    );
    const votesAfter = afterQuery.rows[0].votes;

    expect(votesAfter).toBe(votesBefore + 1);
  });
  test("200: Should return the updated comment obj", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(17);
      });
  });
  test("404: Should return status 404 if comment id does not exist", () => {
    return request(app)
      .patch("/api/comments/10000")
      .send({ inc_votes: 1 })
      .expect(404);
  });
  test("400: Should return status 400 if comment id format invalid", () => {
    return request(app)
      .patch("/api/comments/1sdf")
      .send({ inc_votes: 1 })
      .expect(400);
  });
  test("400: Should return status 400 if increment amount is invalid format", () => {
    return request(app)
      .patch("/api/comments/1sdf")
      .send({ inc_votes: "1sd" })
      .expect(400);
  });
});
