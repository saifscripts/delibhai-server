import mongoose, { Schema, model } from 'mongoose';
import { IDistrict } from './district.interface';

const districtSchema = new Schema<IDistrict>(
    {
        title: String,
        divisionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Division' },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

districtSchema.pre('find', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});

districtSchema.pre('findOne', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});

districtSchema.pre('aggregate', function (next) {
    if (this.options.getAll) {
        return next();
    }
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

export const District = model<IDistrict>('District', districtSchema);
