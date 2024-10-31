import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Upazila } from './upazila.model';

const getUpazilas = async (districtId: string) => {
    const upazilas = await Upazila.find({ districtId });

    if (!upazilas.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'No upazila found!');
    }

    return upazilas;
};

export const UpazilaServices = {
    getUpazilas,
};
