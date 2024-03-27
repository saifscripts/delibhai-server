const Ward = require('../models/Ward');

exports.getWardsByUnionCodeService = async (unionCode) =>
    await Ward.find({ unionCode }).select('-unionCode');
