const User = require('../models/User');

exports.getUserByIdService = async (id) => await User.findById(id).select('-password');

exports.getUserByEmailService = async (email) => await User.findOne({ email });

exports.getUserByMobileService = async (mobile) => await User.findOne({ mobile });

exports.signupService = async (userInfo) => await User.create(userInfo);

exports.updateUserByIdService = async (id, data) => {
    const result = await User.updateOne(
        { _id: id },
        {
            $set: data,
        },
    );

    return result;
};

exports.getUserByMobileService = async (mobile, fields) => {
    const user = await User.findOne({ mobile }).select(fields);

    return user;
};
