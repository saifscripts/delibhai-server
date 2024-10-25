import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Division } from './division.model';

const getAllDivisions = async () => {
    const divisions = await Division.find();

    if (!divisions.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'No division found!');
    }

    return divisions;
};

export const DivisionServices = {
    getAllDivisions,
};
