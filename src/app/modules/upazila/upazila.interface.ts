import mongoose from 'mongoose';

export interface IUpazila {
    title: string;
    districtId: mongoose.Types.ObjectId;
    isDeleted: boolean;
}
