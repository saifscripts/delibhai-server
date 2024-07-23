const mongoose = require('mongoose');

const unionSchema = new mongoose.Schema(
    {
        title: String,
        upazilaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upazila' },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Union', unionSchema);
