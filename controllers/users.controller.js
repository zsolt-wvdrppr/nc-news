const {
  getAllUsers: getAllUsersService,
  getUserByUsername: getUserByUsernameService,
} = require("../services/users.service");

exports.getAllUsers = async (req, res) => {
  const users = await getAllUsersService();
  res.status(200).send({ users });
};

exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;

  const user = await getUserByUsernameService(username);
  res.status(200).send({ user });
};
