const mongoose = require('mongoose');

const upazilaSchema = new mongoose.Schema(
    {
        title: String,
        districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Upazila', upazilaSchema);
