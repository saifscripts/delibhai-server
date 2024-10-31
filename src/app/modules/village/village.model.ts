import { Schema, model } from 'mongoose';
import { IVillage } from './village.interface';

const villageSchema = new Schema<IVillage>(
    {
        unionId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Union',
        },
        wardId: { type: String, required: true },
        title: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

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

export const Village = model<IVillage>('Village', villageSchema);
