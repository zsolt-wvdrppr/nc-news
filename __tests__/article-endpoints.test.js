const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");
const {
  createCommentForArticle,
  updateVotesOfArticle,
} = require("../models/articles.model.js");
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
  test("The method returns an array", () => {
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
        expect(body.message).toBe("Incorrect article id format!");
      });
  });
  test("400: If the comment body has 0 character should return Bad request error", () => {
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
        expect(body.message).toBe("Comment is required!");
      });
  });
  test("400: If the comment body has more than 500 character should return Bad request error", () => {
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
        expect(body.message).toBe(
          "Comment is too long. It must be less than 500 characters!",
        );
      });
  });
});

describe("Model testing: updateVotesOfArticle()", () => {
  test("Method should return updated article object with props: article_id, title, topic, author, body, created_at, votes, article_img_url", () => {
    updateVotesOfArticle(1, { inc_votes: -1 }).then((article) => {
      expect(article).toBeObject();
      expect(article.article_id).toBe(1);
      expect(article.title).toBeString();
      expect(article.topic).toBeString();
      expect(article.author).toBeString();
      expect(article.body).toBeString();
      expect(typeof article.created_at).toBe("object");
      expect(article.votes).toBe(99);
      expect(article.article_img_url).toBeString();
    });
  });
  test("Article should be updated in the database", async () => {
    const votesBefore = await db.query(
      "SELECT votes FROM articles WHERE article_id = $1",
      [1],
    );
    await updateVotesOfArticle(1, { inc_votes: 10 });
    const votesAfter = await db.query(
      "SELECT votes FROM articles WHERE article_id = $1",
      [1],
    );
    expect(votesBefore.rows[0]).not.toEqual(votesAfter.rows[0]);
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: Responds with an object", () => {
    const newVote = 100;
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: newVote,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(201)
      .then((res) => {
        expect(res).toBeObject();
      });
  });
  test("201: The returned article object should have props: article_id, title, topic, author, body, created_at, votes, article_img_url", () => {
    const newVote = 100;
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: newVote,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(201)
      .then(({ body: { article } }) => {
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
  test("201: The article's votes should be updated in the database", async () => {
    const queryResultBefore = await db.query(
      `SELECT * FROM articles WHERE article_id = $1`,
      [1],
    );
    const votesBeforeUpdate = queryResultBefore.rows[0].votes;
    const votesToIncrementBy = 100;
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: votesToIncrementBy,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(201)
      .then(async ({ body: { article: article } }) => {
        const queryResult = await db.query(
          `SELECT * FROM articles WHERE article_id = $1`,
          [article.article_id],
        );
        const articleInDb = queryResult.rows[0];
        expect(articleInDb.article_id).toBe(1);
        expect(articleInDb.title).toBeString();
        expect(articleInDb.topic).toBeString();
        expect(articleInDb.author).toBeString();
        expect(articleInDb.body).toBeString();
        expect(typeof articleInDb.created_at).toBe("object");
        expect(articleInDb.votes).toBe(votesBeforeUpdate + votesToIncrementBy);
        expect(articleInDb.article_img_url).toBeString();
      });
  });
  test("400: If the article ID is invalid format, should return Invalid Type error", () => {
    const newVote = 100;
    return request(app)
      .patch("/api/articles/asdf")
      .send({
        inc_votes: newVote,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Incorrect article id format!");
      });
  });
  test("400: If the req body has incorrect key", () => {
    const newVote = 100;
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votas: newVote,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid key!");
      });
  });
  test("400: If the req body's inc_votes' value's format is incorrect should return Bad request error", () => {
    const newVote = "asdf";
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: newVote,
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Increment amount must be a number!");
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: Should order results by created_at in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        const unsortedColVals = [];
        articles.forEach((article) => {
          unsortedColVals.push(article.created_at);
        });
        const sortedColVals = [...unsortedColVals].sort((a, b) => b - a);
        expect(unsortedColVals).toEqual(sortedColVals);
      });
  });
  test("200: Should order results by created_at in ascending order", () => {
    const order = "asc";
    return request(app)
      .get(`/api/articles?order=${order}`) // Column should use default value
      .expect(200)
      .then(({ body: { articles } }) => {
        const unsortedColVals = [];
        articles.forEach((article) => {
          unsortedColVals.push(article.createdAt);
        });
        const sortedColVals = [...unsortedColVals].sort((a, b) => a - b);
        expect(unsortedColVals).toEqual(sortedColVals);
      });
  });
  test("200: Should order results by votes in ascending order", () => {
    const column = "votes";
    const order = "asc";
    return request(app)
      .get(`/api/articles?order=${order}&sortBy=${column}`)
      .expect(200)
      .then(({ body: { articles } }) => {
        const unsortedColVals = [];
        articles.forEach((article) => {
          unsortedColVals.push(article[column]);
        });
        const sortedColVals = [...unsortedColVals].sort((a, b) => a - b);
        expect(unsortedColVals).toEqual(sortedColVals);
      });
  });
  test("400: Should return Bad Request if column does not exist", () => {
    const column = "apples";
    const order = "asc";
    return request(app)
      .get(`/api/articles?order=${order}&sortBy=${column}`)
      .expect(400);
  });
  test("400: Should return Bad Request if order keyword is wrong", () => {
    const column = "title";
    const order = "asdf";
    return request(app)
      .get(`/api/articles?order=${order}&sortBy=${column}`)
      .expect(400);
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200: Returns an array of articles of the specified topic", () => {
    const topic = "cats";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.topic).toBe(topic);
        });
      });
  });
  test("200: Returns an array of articles of the specified topic", () => {
    const topic = "paper";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.topic).toBe(topic);
        });
      });
  });
  test("404: Returns Not Found error", () => {
    const topic = "asdf";
    return request(app).get(`/api/articles?topic=${topic}`).expect(404);
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200: Returned article object should contain comment_count prop", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(typeof parseInt(article.comment_count)).toBe("number");
        expect(parseInt(article.comment_count)).toBe(11);
      });
  });
});

describe("POST /api/articles", () => {
  test("201: Should be avilable on /api/articles", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "Issa new article",
        body: "Loerm ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
        topic: "mitch",
        article_img_url: "",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toBeObject();
      });
  });
  test("201: Should return the newly added article with following props: author, title, body, topic, article_img_url, article_id, votes, created_at, comment_count.", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "Issa new article",
        body: "Loerm ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
        topic: "mitch",
        article_img_url: "",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toBeObject();
        expect(article.article_id).toBe(14);
        expect(article.title).toBeString();
        expect(article.topic).toBeString();
        expect(article.author).toBeString();
        expect(article.body).toBeString();
        expect(article.created_at).toBeString();
        expect(article.votes).toBeNumber();
        expect(article.article_img_url).toBeString();
        expect(Number(article.comment_count)).toBeNumber();
      });
  });
  test("404: Should return Not Found Error if author does not exist or missing.", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Issa new article",
        body: "Loerm ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
        topic: "mitch",
        article_img_url: "",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(404);
  });
  test("404: Should return Not Found Error if topic does not exist or missing.", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "Issa new article",
        body: "Loerm ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
        article_img_url: "",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(404);
  });
  test("400: Should return Bad Request Error if article title or body missing from request body.", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        topic: "mitch",
        body: "Loerm ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
        article_img_url: "",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(400);
  });
  test("400: Should return Bad Request Error if article title is longer than 255 char.", () => {
    const testContent256length = generateText(256);

    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: testContent256length,
        topic: "mitch",
        body: "Loerm ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
        article_img_url: "",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(400);
  });
  test("400: Should return Bad Request Error if article body is longer than 600 char.", () => {
    const testContent601length = generateText(601);

    return request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: testContent601length,
        topic: "mitch",
        body: "Loerm ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.",
        article_img_url: "",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /application\/json/)
      .expect(400);
  });
});

describe("GET /api/articles pagination", () => {
  test("200: The retunred object should have a total_count prop besides articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles, total_count } = response.body;
        expect(total_count).toBe(13);
      });
  });
});
