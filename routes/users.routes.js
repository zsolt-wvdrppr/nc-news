const app = require("express");
const { getAllUsers } = require("../controllers/users.controller");

const usersRouter = app.Router();

usersRouter.get("/", getAllUsers);

module.exports = usersRouter;
