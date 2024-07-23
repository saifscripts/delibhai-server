import { Schema, model } from 'mongoose';
import { IRider } from './rider.interface';

const riderSchema = new Schema<IRider>(
    {
        id: { type: String, required: true, unique: true },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User',
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

export const Rider = model<IRider>('Rider', riderSchema);
