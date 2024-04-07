const Village = require('../models/Village');

exports.getVillagesByUnionIdService = async (unionId) => await Village.find({ unionId });

exports.createVillagesService = async (villages) => await Village.insertMany(villages);

exports.updateVillageByIdService = async (id, data) => {
    const result = await Village.updateOne(
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

exports.deleteVillageByIdService = async (id) => {
    const result = await Village.deleteOne({ _id: id });
    return result;
};

// exports.getVillageByIdService = async (id) => await Village.findById(id);
