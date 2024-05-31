const User = require('../models/User');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

exports.getUserByIdService = async (id) => {
  let user;

  // START: logic for removing invalid field values
  // N.B.: This codeblock should remove in the future
  user = await User.findById(id).lean();

  const fields = {};

  if (
    user?.presentAddress?.division &&
    !ObjectId.isValid(user?.presentAddress?.division)
  ) {
    fields.presentAddress = 1;
  }

  if (
    user?.permanentAddress?.division &&
    !ObjectId.isValid(user?.permanentAddress?.division)
  ) {
    fields.permanentAddress = 1;
  }

  if (
    user?.serviceAddress?.division &&
    !ObjectId.isValid(user?.serviceAddress?.division)
  ) {
    fields.serviceAddress = 1;
  }

  if (
    user?.ownerAddress?.division &&
    !ObjectId.isValid(user?.ownerAddress?.division)
  ) {
    fields.ownerAddress = 1;
  }

  if (
    user?.manualLocation?.division &&
    !ObjectId.isValid(user?.manualLocation?.division)
  ) {
    fields.manualLocation = 1;
  }

  await User.updateOne({ _id: id }, { $unset: fields });
  // END: logic for removing invalid field values

  user = await User.findById(id)
    .select('-password')
    .populate({
      path: 'presentAddress permanentAddress ownerAddress serviceAddress manualLocation mainStation',
      populate: {
        path: 'division district upazila union village',
        select: 'title unionId wardId',
      },
    });
  return user;
};

exports.getUserByEmailService = async (email) => await User.findOne({ email });

exports.getUserByMobileService = async (mobile) =>
  await User.findOne({ mobile });

exports.signupService = async (userInfo) => await User.create(userInfo);

exports.updateUserByIdService = async (id, data) => {
  const result = await User.updateOne(
    { _id: id },
    {
      $set: data,
    },
    {
      runValidators: true,
    }
  );

  return result;
};

exports.removeUserFieldsByIdService = async (id, fields) => {
  const result = await User.updateOne(
    { _id: id },
    {
      $unset: fields,
    }
  );

  return result;
};

exports.getUserByMobileService = async (mobile, fields) => {
  const user = await User.findOne({ mobile }).select(fields);

  return user;
};

exports.getHerosService = async (query) => {
  const { vehicle, dVil } = query;

  const heros = await User.aggregate([
    {
      $match: {
        $and: [
          { vehicleType: vehicle },
          {
            $or: [
              { 'serviceAddress.village': new ObjectId(dVil) },
              { 'mainStation.village': new ObjectId(dVil) },
            ],
          },
          {
            $or: [
              { 'liveLocation.timestamp': { $gt: Date.now() - 5000 } },
              {
                'manualLocation.latitude': { $exists: true },
                'manualLocation.longitude': { $exists: true },
              },
            ],
          },
        ],
      },
    },
    {
      $project: {
        name: 1,
        avatarURL: 1,
        mobile: 1,
        serviceTimes: 1,
        manualLocation: 1,
        liveLocation: {
          $cond: {
            if: { $gt: ['$liveLocation.timestamp', Date.now() - 5000] },
            then: '$liveLocation',
            else: undefined,
          },
        },
        serviceAddress: 1,
        mainStation: 1,
        isLive: {
          $cond: {
            if: { $gt: ['$liveLocation.timestamp', Date.now() - 5000] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  return heros;
};
