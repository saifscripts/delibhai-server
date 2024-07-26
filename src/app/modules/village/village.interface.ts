import { Types } from 'mongoose';

export interface IVillage {
    unionId: Types.ObjectId;
    wardNo: string;
    title: string;
    isDeleted: boolean;
}
