import { Schema, model } from 'mongoose';
import { IVillage } from './village.interface';

const villageSchema = new Schema<IVillage>(
    {
        unionId: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            // ref: 'Union',
        },
        wardNo: { type: String, required: true },
        title: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

export const Village = model<IVillage>('Village', villageSchema);
