\c nc_news
-- Get all of the users
SELECT
    *
FROM
    users;

-- Get all of the articles where the topic is coding
SELECT
    *
FROM
    articles
WHERE
    topic = 'coding';

-- Get all of the comments where the votes are less than zero
SELECT
    *
FROM
    comments
WHERE
    votes < 0;

-- Get all of the topics
SELECT
    *
FROM
    topics;

-- Get all of the articles by user grumpy19
SELECT
    *
FROM
    articles
WHERE
    author = 'grumpy19';

-- Get all of the comments that have more than 10 votes.
SELECT
    *
FROM
    comments
WHERE
    votes > 10;

