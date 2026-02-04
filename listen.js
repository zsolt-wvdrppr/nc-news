import app from "./app.js";
import dotenv from "dotenv";

const ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: `${process.cwd()}/.env.${ENV}` });

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
