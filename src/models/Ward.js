const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema(
    {
        unionCode: String,
        wardCode: String,
        wardNo: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Ward', wardSchema);
