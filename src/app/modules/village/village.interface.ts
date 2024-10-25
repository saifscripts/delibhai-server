import mongoose from 'mongoose';

export interface IVillage {
    unionId: mongoose.Types.ObjectId;
    wardId: string;
    title: string;
    isDeleted: boolean;
}
