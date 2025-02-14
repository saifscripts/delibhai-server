import { Schema, model } from 'mongoose';
import { IVehicleCategory } from './vehicle-category.interface';

const vehicleCategorySchema = new Schema<IVehicleCategory>(
    {
        icon: { type: String, required: true },
        title: { type: String, required: true, unique: true },
        title_en: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        order: { type: Number, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

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

export const VehicleCategory = model<IVehicleCategory>(
    'vehicleCategory',
    vehicleCategorySchema,
);
