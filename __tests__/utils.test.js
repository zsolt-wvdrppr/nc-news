const {
  findPropWhereMatches,
  getColValues,
  getColTitles,
} = require("../db/seeds/utils");
const data = require("../db/data/test-data/index");

describe("getColTitles()", () => {
  test("Should return a string", () => {
    const colTitles = getColTitles(data.userData);

    expect(typeof colTitles).toBe("string");
  });
  test("Should return the column titles in a string", () => {
    const colTitles = getColTitles(data.userData);
    const expected = "username,name,avatar_url";

    expect(colTitles).toBe(expected);
  });
});

describe("getColValues()", () => {
  test("Should return an array", () => {
    const colValues = getColValues(data.userData);

    expect(typeof colValues).toBe("object");
    expect(colValues.length >= 0).toBe(true);
  });

  test("Should return the data values in a nested array per row", () => {
    const testData = [
      {
        description: "aaa",
        slug: "mitch",
        img_url: "placeholder.jpg",
      },
      {
        description: "bbb",
        slug: "cats",
        img_url: "placeholder.jpg",
      },
    ];
    const expected = [
      ["aaa", "mitch", "placeholder.jpg"],
      ["bbb", "cats", "placeholder.jpg"],
    ];
    const colValues = getColValues(testData);

    expect(colValues).toEqual(expected);
  });
});

describe("findPropWhereMatches()", () => {
  test("Should return a value from the matching row", () => {
    const testDataArr = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const testObjToMatchAgainst = {
      title: "Living in the shadow of a great man",
      votes: 984,
    };
    const id = findPropWhereMatches(
      "article_id",
      "title",
      testObjToMatchAgainst.title,
      testDataArr,
    );

    const expectedVal = 1;

    expect(id).toBe(expectedVal);
  });
  test("Should handle no match gracefully, should return null", () => {
    const testDataArr = [
      {
        article_id: 1,
        title: "Living in the shadow of a man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const testObjToMatchAgainst = {
      title: "Living in the shadow of a great man",
      votes: 984,
    };
    const id = findPropWhereMatches(
      "article_id",
      "title",
      testObjToMatchAgainst.title,
      testDataArr,
    );

    const expectedVal = null;

    expect(id).toBe(expectedVal);
  });
});
