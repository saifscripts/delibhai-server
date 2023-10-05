const User = require('../models/User');

// Example service methods
exports.getAllUsersService = async() => {
  return User.find();
}

exports.createUserService = async(userData) => {
  return User.create(userData);
}
