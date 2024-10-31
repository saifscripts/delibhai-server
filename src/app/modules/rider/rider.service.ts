import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { USER_ROLE } from '../user/user.constant';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

// const modifyCollection = async () => {
//     const riders = await User.find().lean();

//     console.log({ riders: riders.length });

//     const updatedRiders = [];

//     for (let i = 0; i < riders.length; i++) {
//         const rider = riders[i];

//         const serviceArea = rider?.serviceArea;

//         if (!serviceArea) {
//             updatedRiders.push(rider);
//             continue;
//         }

//         if (!Array.isArray(serviceArea)) {
//             rider.serviceArea = [];
//         } else {
//             for (let j = 0; j < serviceArea.length; j++) {
//                 const area = serviceArea[j];
//                 const divisionId = area?.division;

//                 if (Types.ObjectId.isValid(divisionId)) {
//                     const division = await Division.findById(divisionId);
//                     area.division = {
//                         title: division?.title,
//                         _id: division?._id,
//                     };
//                 } else if (typeof divisionId === 'string') {
//                     const division = await Division.findOne({
//                         title: divisionId,
//                     });
//                     area.division = {
//                         title: division?.title,
//                         _id: division?._id,
//                     };
//                     console.log({ division });
//                 } else {
//                     // area.division = undefined;
//                     console.log({ divisionId });
//                 }

//                 const districtId = area?.district;

//                 if (Types.ObjectId.isValid(districtId)) {
//                     const district = await District.findById(districtId);
//                     area.district = {
//                         title: district?.title,
//                         _id: district?._id,
//                     };
//                 } else if (typeof districtId === 'string') {
//                     const district = await District.findOne({
//                         title: districtId,
//                     });
//                     area.district = {
//                         title: district?.title,
//                         _id: district?._id,
//                     };
//                 } else {
//                     // area.district = undefined;
//                     console.log({ districtId });
//                 }

//                 const upazilaId = area?.upazila;

//                 if (Types.ObjectId.isValid(upazilaId)) {
//                     const upazila = await Upazila.findById(upazilaId);
//                     area.upazila = {
//                         title: upazila?.title,
//                         _id: upazila?._id,
//                     };
//                 } else if (typeof upazilaId === 'string') {
//                     const upazila = await Upazila.findOne({ title: upazilaId });
//                     area.upazila = {
//                         title: upazila?.title,
//                         _id: upazila?._id,
//                     };
//                 } else {
//                     // area.upazila = undefined;
//                     console.log({ upazilaId });
//                 }

//                 const unionId = area?.union;

//                 if (Types.ObjectId.isValid(unionId)) {
//                     const union = await Union.findById(unionId);
//                     area.union = {
//                         title: union?.title,
//                         _id: union?._id,
//                     };
//                 } else if (typeof unionId === 'string') {
//                     const union = await Union.findOne({ title: unionId });
//                     area.union = {
//                         title: union?.title,
//                         _id: union?._id,
//                     };
//                 } else {
//                     // area.union = undefined;
//                     console.log({ unionId });
//                 }

//                 const villages = area?.village;

//                 if (!villages) {
//                     area.village = [];
//                 } else {
//                     for (let k = 0; k < villages.length; k++) {
//                         const villageId = villages[k];

//                         if (Types.ObjectId.isValid(villageId)) {
//                             const village = await Village.findById(villageId);
//                             area.village[k] = {
//                                 title: village?.title,
//                                 _id: village?._id,
//                             };
//                         } else if (typeof villageId === 'string') {
//                             const village = await Village.findOne({
//                                 title: villageId,
//                             });
//                             area.village[k] = {
//                                 title: village?.title,
//                                 _id: village?._id,
//                             };
//                         } else {
//                             // area.village = undefined;
//                             console.log({ villageId });
//                         }
//                     }
//                 }

//                 rider.serviceArea[j] = area;
//             }
//         }

//         console.log(i + 1);

//         await User.findByIdAndUpdate(rider._id, {
//             serviceArea: rider.serviceArea,
//         });
//     }

//     console.log({ updatedRiders: updatedRiders.length });

//     return [];
// };

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

const getLocation = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return user?.liveLocation;
};

export const RiderServices = {
    getRiders,
    updateRider,
    updateLocation,
    getLocation,
};
