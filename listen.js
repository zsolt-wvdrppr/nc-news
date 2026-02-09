const app = require("./app.js");
const dotenv = require("dotenv");

const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `${process.cwd()}/.env.${ENV}` });

const { PORT } = process.env;

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not configured");
}

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
