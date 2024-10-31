import mongoose, { Schema, model } from 'mongoose';
import { IUnion } from './union.interface';

const unionSchema = new Schema<IUnion>(
    {
        title: String,
        upazilaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upazila' },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

unionSchema.pre('find', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});

unionSchema.pre('findOne', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true } });
    next();
});

unionSchema.pre('aggregate', function (next) {
    if (this.options.getAll) {
        return next();
    }
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

export const Union = model<IUnion>('Union', unionSchema);
