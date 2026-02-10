# NC-News Project

NC News was a **Solo Project** I built during a Northcorders bootcamp. Now it has a completely functioning database and backend. The frontend is coming soon. All the endpoints are tested with Jest, and they also have effective error handling including user friendly error messages and appropriate status codes.

I used JavaScript and Postgres SQL for database creation and seeding (see `/db folder`).

Express JS for the backend server (see layers in the following folders: `/routes`, `/controllers`, `/services`, `/models`).

Jest for testing (see `/__tests__` folder)

HTML, CSS, JavaScript for the documentation (see `/public` folder or live link below).

## 🔌Available endpoints with query parameters

🌐 Find the complete documentation about the available endpoints here: https://zsolts-news.onrender.com/api.

The database is hosted on Supabase, and the Express JS server is on reder.com.

**📌Please note, because the server is on a free tier instance it will spin down with inactivity, which can delay requests by 50 seconds or more.**

| Description                      | Endpoint                                 | Query params                                      | Request body                                 | Response body                                |
| -------------------------------- | ---------------------------------------- | ------------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| List all available articles      | GET`/api/articles`                       | `sortBy=[column], order=[asc/desc], topic=[slag]` | -                                            | `{ "articles":[...] }`                       |
| Get an article by article\*id    | GET`/api/articles/:article_id`           | -                                                 | -                                            | `{ "article": {...} }`                       |
| Get all comments of an article   | GET`/api/articles/:article_id/comments`  | -                                                 | -                                            | `{ "comments":[...] }`                       |
| Post a new comment to an article | POST`/api/articles/:article_id/comments` | -                                                 | `{ username: "[string]", body: "[string]" }` | \_Posed comment obj\* `{ "comment":{...} }`  |
| Update votes of an article       | PATCH`/api/articles/:article_id`         | -                                                 | `{ inc_votes: [int] }`                       | _Updated article obj_ `{ "article": {...} }` |
| Delete a comment by comment_id   | DELETE`/api/comments/:comment_id`        | -                                                 | -                                            | -                                            |
| Get all topics                   | GET`/api/topics`                         | -                                                 | -                                            | `{ topics: [...] }`                          |
| Get all users                    | GET`/api/users`                          | -                                                 | -                                            | `{ users: [...] }`                           |

## 💻Installation on localhost

### Make sure you have a postgres installed locally

_Postgres documentation:_ https://www.postgresql.org/docs/current/tutorial-install.html

### Clone the repository:

`git clone https://github.com/zsolt-wvdrppr/nc-news.git`

### Install packages:

`npm install`

### Add environment files

_.env.test - for testing with Jest_
`PGDATABASE=nc_news_test`
`PORT=8000`
_.env.development - for testing with local server. (eg. using Insomnia or Postman)_
`PGDATABASE=nc_news`
`PORT=8000`

### Set up databases

Run `npm run setup-dbs`. This will set up the nc_news and nc_news_test database.

### At this point you'll be able to run tests using Jest

Use `npm test` in the terminal to run the tests which are within the `__tests__` folder. At each run, Jest will set seed the database to make sure it always starts with a clean slate.

### Seed development database

Run `npm run seed-dev` in the terminal. This will seed the nc_news database with the sample data.

### Run local server to test endpoints locally

Run `npm run start`. It will start the server on port 8000 (or else if set otherwise in .env file)

## ⛓️Entity-Relationship Diagram

![**Entity-Relationship Diagram**](https://github.com/zsolt-wvdrppr/nc-news/blob/main/img/ncnews-ERD.png?raw=true)

## 👤About the author

Junior Developer transitioning from digital marketing and technical operations, with a passion for solving practical problems. Experienced in automating workflows, integrating business requirements into technical solutions, and optimising platforms. Skilled in JavaScript, HTML, CSS, with a working knowledge of C# and Python, and hands-on experience building reliable, efficient, and user-focused applications. Driven by curiosity, persistence, and a problem-solving mindset to deliver practical, high-quality software solutions.
