const {
  getAllUsers: getAllUsersService,
} = require("../services/users.service");

exports.getAllUsers = async (req, res) => {
  const users = await getAllUsersService();
  res.status(200).send({ users });
};
