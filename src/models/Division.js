const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema(
    {
        title: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Division', divisionSchema);
