const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema(
    {
        title: String,
        divisionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('District', districtSchema);
