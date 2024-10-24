import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';

const getUser = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return user;
};

const updateUserIntoDB = async (id: string, payload: Partial<IUser>) => {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if (!updatedUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update user!');
    }

    return updatedUser;
};

export const UserServices = {
    getUser,
    updateUserIntoDB,
};
