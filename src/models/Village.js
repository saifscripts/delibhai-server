const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema(
    {
        unionId: String,
        wardId: String,
        title: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Village', villageSchema);
