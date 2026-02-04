const app = require("./app.js");
const dotenv = require("dotenv");

const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `${process.cwd()}/.env.${ENV}` });

const { PORT } = process.env;

if (!process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured");
} else {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
