import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { District } from './district.model';

const getDistricts = async (divisionId: string) => {
    const districts = await District.find({ divisionId });

    if (!districts.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'No district found!');
    }

    return districts;
};

export const DistrictServices = {
    getDistricts,
};
