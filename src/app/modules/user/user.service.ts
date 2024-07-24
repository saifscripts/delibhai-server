import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Rider } from '../rider/rider.model';
import { IUser } from './user.interface';
import { User } from './user.model';

const getUserFromDB = async (id: string) => {
    const user = await User.findById(id).lean();

    let profile;

    if (user!.role === 'rider') {
        profile = await Rider.findOne({ user: user!._id }).lean();
        // .populate({
        //     path: 'presentAddress permanentAddress ownerAddress serviceAddress manualLocation mainStation',
        //     populate: {
        //         path: 'division district upazila union village',
        //         select: 'title unionId wardId',
        //     },
        // });
    }

    if (!profile) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return { ...user, ...profile };
};

const updateUserIntoDB = async (id: string, payload: Partial<IUser>) => {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return await getUserFromDB(id);
};

export const UserServices = {
    updateUserIntoDB,
    getUserFromDB,
};
