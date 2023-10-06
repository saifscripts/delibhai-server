const User = require('../models/User');

// Example service methods
exports.getUserByIdService = async(id) => {
  return await User.findById(id)
}

exports.signupService = async(userInfo) => {
  return await User.create(userInfo);
}
