const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema(
    {
        unionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Union' },
        wardId: String,
        title: String,
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Village', villageSchema);
