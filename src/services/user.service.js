const User = require('../models/User');

exports.getUserByIdService = async (id) => {
    const user = await User.findById(id)
        .select('-password')
        .populate({
            path: 'presentAddress permanentAddress ownerAddress serviceAddress manualLocation',
            populate: {
                path: 'division district upazila union village',
                select: 'title unionId wardId',
            },
        });
    return user;
};

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
    const { vehicle, dVil } = query;
    const heros = await User.find({
        vehicleType: vehicle,
        serviceAddress: { $elemMatch: { village: dVil } },
    }).select('name avatarURL mobile serviceTimes liveLocation serviceAddress');

    return heros;
};
