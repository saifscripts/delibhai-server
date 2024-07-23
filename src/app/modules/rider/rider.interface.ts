import { Types } from 'mongoose';

export interface IRider {
    id: string;
    user: Types.ObjectId;
    isDeleted: boolean;
}
