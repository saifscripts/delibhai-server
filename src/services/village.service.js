const Village = require('../models/Village');

exports.getVillagesByUnionValueService = async (unionValue) =>
    await Village.find({ unionValue }).select('-unionValue');
