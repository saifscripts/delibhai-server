import mongoose from 'mongoose';

export interface IUnion {
    title: string;
    upazilaId: mongoose.Types.ObjectId;
    isDeleted: boolean;
}
