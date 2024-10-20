import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserServices } from '../user/user.service';
import { IRider } from './rider.interface';
import { Rider } from './rider.model';

const updateRiderIntoDB = async (id: string, payload: IRider) => {
    const updatedRider = await Rider.findOneAndUpdate({ user: id }, payload, {
        new: true,
    });

    if (!updatedRider) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update rider!');
    }

    return await UserServices.getUserFromDB(id);
};

export const RiderServices = {
    updateRiderIntoDB,
};
