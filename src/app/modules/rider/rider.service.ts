import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IRider } from './rider.interface';
import { Rider } from './rider.model';

const updateRiderIntoDB = async (id: string, payload: IRider) => {
    const updatedRider = await Rider.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if (!updatedRider) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update rider!');
    }

    return updatedRider;
};

export const RiderServices = {
    updateRiderIntoDB,
};
