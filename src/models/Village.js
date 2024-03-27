const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema(
    {
        wardCode: String,
        villageCode: String,
        villageName: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Village', villageSchema);
