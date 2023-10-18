const User = require('../models/User');

exports.getUserByIdService = async (id) => await User.findById(id);

exports.signupService = async (userInfo) => await User.create(userInfo);

exports.updateUserByIdService = async (id, data) =>
    await User.updateOne(
        { _id: id },
        {
            $set: data,
        },
    );
