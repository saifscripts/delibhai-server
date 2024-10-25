import mongoose from 'mongoose';

export interface IDistrict {
    title: string;
    divisionId: mongoose.Types.ObjectId;
    isDeleted: boolean;
}
