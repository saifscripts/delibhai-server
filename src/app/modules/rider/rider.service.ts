import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { USER_ROLE } from '../user/user.constant';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const getRiders = async (query: Record<string, unknown>) => {
    const { vehicle, dVil } = query;

    const riders = await User.aggregate([
        {
            $match: {
                $and: [
                    { vehicleType: vehicle, role: USER_ROLE.rider },
                    {
                        $or: [
                            {
                                'serviceAddress.village':
                                    new mongoose.Types.ObjectId(dVil as string),
                            },
                            {
                                'mainStation.village':
                                    new mongoose.Types.ObjectId(dVil as string),
                            },
                        ],
                    },
                    {
                        $or: [
                            {
                                'liveLocation.timestamp': {
                                    $gt: Date.now() - 5000,
                                },
                            },
                            {
                                'manualLocation.latitude': { $exists: true },
                                'manualLocation.longitude': { $exists: true },
                            },
                        ],
                    },
                ],
            },
        },
        {
            $lookup: {
                from: 'villages',
                localField: 'mainStation.village',
                foreignField: '_id',
                as: 'mainStation.village',
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: {
                path: '$mainStation.village',
            },
        },
        {
            $project: {
                name: 1,
                avatarURL: 1,
                mobile: 1,
                serviceTimes: 1,
                manualLocation: 1,
                liveLocation: {
                    $cond: {
                        if: {
                            $gt: ['$liveLocation.timestamp', Date.now() - 5000],
                        },
                        then: '$liveLocation',
                        else: undefined,
                    },
                },
                mainStation: 1,
                isLive: {
                    $cond: {
                        if: {
                            $gt: ['$liveLocation.timestamp', Date.now() - 5000],
                        },
                        then: true,
                        else: false,
                    },
                },
                serviceStatus: 1,
            },
        },
    ]);

    return riders;
};

const updateRider = async (id: string, payload: IUser) => {
    const updatedRider = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if (!updatedRider) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update rider!');
    }

    return updatedRider;
};

const updateLocation = async (
    id: string,
    payload: Pick<IUser, 'liveLocation'>,
) => {
    payload.liveLocation.timestamp = Date.now();

    const updatedRider = await User.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if (!updatedRider) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update rider!');
    }

    return null;
};

export const RiderServices = {
    getRiders,
    updateRider,
    updateLocation,
};
