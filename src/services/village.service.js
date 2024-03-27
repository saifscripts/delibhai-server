const Village = require('../models/Village');

exports.getVillagesByWardCodeService = async (wardCode) =>
    await Village.find({ wardCode }).select('-wardCode');
