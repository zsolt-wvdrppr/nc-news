const app = require("express");
const { getAllUsers } = require("../controllers/users.controller");
const { getUserByUsername } = require("../controllers/users.controller");

const usersRouter = app.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
