const NotFoundError = require("../errors/NotFoundError");
const { fetchAllUsers, fetchUserByUsername } = require("../models/users.model");

exports.getAllUsers = () => {
  return fetchAllUsers();
};

exports.getUserByUsername = async (username) => {
  const result = await fetchUserByUsername(username);
  if (result === undefined) throw new NotFoundError("User not found!");
  return result;
};
