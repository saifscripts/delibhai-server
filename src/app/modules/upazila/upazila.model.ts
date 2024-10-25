import mongoose, { Schema, model } from 'mongoose';
import { IUpazila } from './upazila.interface';

const upazilaSchema = new Schema<IUpazila>(
    {
        title: String,
        districtId: { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

upazilaSchema.pre('find', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});

upazilaSchema.pre('findOne', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});

upazilaSchema.pre('aggregate', function (next) {
    if (this.options.getAll) {
        return next();
    }
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

export const Upazila = model<IUpazila>('Upazila', upazilaSchema);
