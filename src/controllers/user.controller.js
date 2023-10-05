const { getAllUsersService, createUserService } = require("../services/user.service");

exports.getAllUsers = async(req, res) => {
  const users = await getAllUsersService();
  res.json(users);
}

exports.createUser = async(req, res) => {
  const userData = req.body;
  const user = await createUserService(userData);
  res.json(user);
}

