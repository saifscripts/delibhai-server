import { Schema, model } from 'mongoose';
import { IDivision } from './division.interface';

const divisionSchema = new Schema<IDivision>(
    {
        title: String,
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

divisionSchema.pre('find', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});

divisionSchema.pre('findOne', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});

divisionSchema.pre('aggregate', function (next) {
    if (this.options.getAll) {
        return next();
    }
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

export const Division = model<IDivision>('Division', divisionSchema);
