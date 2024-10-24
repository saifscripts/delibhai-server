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

const updateAvatar = async (id: string, payload: Partial<IUser>) => {
    const updatedUser = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if (!updatedUser) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to update avatar!',
        );
    }

    return updatedUser;
};

const deleteAvatar = async (id: string) => {
    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            $unset: {
                avatarURL: 1,
                avatarOriginURL: 1,
                avatarCropData: 1,
            },
        },
        {
            new: true,
        },
    );

    if (!updatedUser) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to delete user!',
        );
    }

    return updatedUser;
};

export const UserServices = {
    getUser,
    updateAvatar,
    deleteAvatar,
};
