"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleCategory = void 0;
const mongoose_1 = require("mongoose");
const vehicleCategorySchema = new mongoose_1.Schema({
    icon: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    title_en: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
vehicleCategorySchema.pre('find', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});
vehicleCategorySchema.pre('findOne', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});
vehicleCategorySchema.pre('aggregate', function (next) {
    if (this.options.getAll) {
        return next();
    }
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});
exports.VehicleCategory = (0, mongoose_1.model)('vehicleCategory', vehicleCategorySchema);
