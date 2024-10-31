import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Union } from './union.model';

const getUnions = async (upazilaId: string) => {
    const unions = await Union.find({ upazilaId });

    if (!unions.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'No union found!');
    }

    return unions;
};

export const UnionServices = {
    getUnions,
};
