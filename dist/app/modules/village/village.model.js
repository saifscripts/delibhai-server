"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Village = void 0;
const mongoose_1 = require("mongoose");
const villageSchema = new mongoose_1.Schema({
    unionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Union',
    },
    wardId: { type: String, required: true },
    title: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
villageSchema.pre('find', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});
villageSchema.pre('findOne', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});
villageSchema.pre('aggregate', function (next) {
    if (this.options.getAll) {
        return next();
    }
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});
exports.Village = (0, mongoose_1.model)('Village', villageSchema);
