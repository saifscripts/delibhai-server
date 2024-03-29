const Village = require('../models/Village');

exports.getVillagesByUnionValueService = async (unionValue) =>
    await Village.find({ unionValue }).select('-unionValue');

exports.getAllVillagesService = async () => await Village.find();
exports.createVillagesService = async (villages) => await Village.insertMany(villages);
