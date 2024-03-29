const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema(
    {
        unionValue: String,
        wardValue: String,
        value: String,
        title: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Village', villageSchema);
