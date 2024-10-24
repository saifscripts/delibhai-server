import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from './user.model';

const getUser = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return user;
};

export const UserServices = {
    getUser,
};
