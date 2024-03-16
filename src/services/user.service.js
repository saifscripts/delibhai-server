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
        {
            runValidators: true,
        },
    );

    return result;
};

exports.removeUserFieldsByIdService = async (id, fields) => {
    const result = await User.updateOne(
        { _id: id },
        {
            $unset: fields,
        },
    );

    return result;
};

exports.getUserByMobileService = async (mobile, fields) => {
    const user = await User.findOne({ mobile }).select(fields);

    return user;
};

exports.getHerosService = async (query) => {
    const { vehicle, ...manualLocation } = query;

    console.log({ vehicleType: vehicle, manualLocation });

    const heros = await User.find({ vehicleType: vehicle, manualLocation });
    return heros;
};
