"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
// TODO: Add service area filter
const getRiders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleType, latitude, longitude, limit, page, destinations } = query;
    const skip = (page - 1) * limit;
    const toRadians = Math.PI / 180;
    const bangladeshTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Dhaka',
    });
    const currentTime = new Date(bangladeshTime);
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    let filters = {
        vehicleType,
        role: user_constant_1.USER_ROLE.rider,
    };
    if (destinations) {
        filters = {
            vehicleType,
            role: user_constant_1.USER_ROLE.rider,
        };
        // destinations.forEach(dest => {
        // })
    }
    const riders = yield user_model_1.User.aggregate([
        // Match riders with the given vehicle type and role
        {
            $match: filters,
        },
        // Add a field "isLive" which is true if liveLocation is not null and timestamp is within last 5 seconds, otherwise false
        {
            $addFields: {
                isLive: {
                    $cond: {
                        if: {
                            $and: [
                                { $ifNull: ['$liveLocation', false] },
                                {
                                    $gte: [
                                        '$liveLocation.timestamp',
                                        Date.now() - 5 * 1000,
                                    ],
                                },
                            ],
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        // Add a field "location" which selects liveLocation if isLive is true, otherwise manualLocation
        {
            $addFields: {
                location: {
                    $cond: {
                        if: { $ifNull: ['$isLive', true] },
                        then: '$liveLocation',
                        else: '$manualLocation',
                    },
                },
            },
        },
        // Match riders with a valid location
        {
            $match: {
                location: { $exists: true, $ne: null },
            },
        },
        // Add a field "distance" which calculates the distance between the rider's location and the given latitude and longitude
        {
            $addFields: {
                distance: {
                    $let: {
                        vars: {
                            lat1: latitude * toRadians,
                            lon1: longitude * toRadians,
                            lat2: {
                                $multiply: ['$location.latitude', toRadians],
                            },
                            lon2: {
                                $multiply: ['$location.longitude', toRadians],
                            },
                        },
                        in: {
                            $multiply: [
                                6371,
                                {
                                    $acos: {
                                        $add: [
                                            {
                                                $multiply: [
                                                    { $sin: '$$lat1' },
                                                    { $sin: '$$lat2' },
                                                ],
                                            },
                                            {
                                                $multiply: [
                                                    { $cos: '$$lat1' },
                                                    { $cos: '$$lat2' },
                                                    {
                                                        $cos: {
                                                            $subtract: [
                                                                '$$lon2',
                                                                '$$lon1',
                                                            ],
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
                // Add a field "isOnline" which is true if serviceStatus is "on", false if "off", otherwise true if any of the serviceTimeSlots is currently active
                isOnline: {
                    $cond: {
                        if: { $eq: ['$serviceStatus', 'on'] },
                        then: true,
                        else: {
                            $cond: {
                                if: { $eq: ['$serviceStatus', 'off'] },
                                then: false,
                                else: {
                                    $reduce: {
                                        input: '$serviceTimeSlots',
                                        initialValue: false,
                                        in: {
                                            $cond: [
                                                '$$value',
                                                true,
                                                {
                                                    $let: {
                                                        vars: {
                                                            startMinutes: {
                                                                $add: [
                                                                    {
                                                                        $multiply: [
                                                                            {
                                                                                $toInt: {
                                                                                    $arrayElemAt: [
                                                                                        {
                                                                                            $split: [
                                                                                                '$$this.start',
                                                                                                ':',
                                                                                            ],
                                                                                        },
                                                                                        0,
                                                                                    ],
                                                                                },
                                                                            },
                                                                            60,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $toInt: {
                                                                            $arrayElemAt: [
                                                                                {
                                                                                    $split: [
                                                                                        '$$this.start',
                                                                                        ':',
                                                                                    ],
                                                                                },
                                                                                1,
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                            endMinutes: {
                                                                $add: [
                                                                    {
                                                                        $multiply: [
                                                                            {
                                                                                $toInt: {
                                                                                    $arrayElemAt: [
                                                                                        {
                                                                                            $split: [
                                                                                                '$$this.end',
                                                                                                ':',
                                                                                            ],
                                                                                        },
                                                                                        0,
                                                                                    ],
                                                                                },
                                                                            },
                                                                            60,
                                                                        ],
                                                                    },
                                                                    {
                                                                        $toInt: {
                                                                            $arrayElemAt: [
                                                                                {
                                                                                    $split: [
                                                                                        '$$this.end',
                                                                                        ':',
                                                                                    ],
                                                                                },
                                                                                1,
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        in: {
                                                            $and: [
                                                                {
                                                                    $gte: [
                                                                        currentMinutes,
                                                                        '$$startMinutes',
                                                                    ],
                                                                },
                                                                {
                                                                    $lte: [
                                                                        currentMinutes,
                                                                        '$$endMinutes',
                                                                    ],
                                                                },
                                                            ],
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        // Sort by isOnline (true first), then by distance, then by isLive (true first), then by createdAt
        {
            $sort: { isOnline: -1, distance: 1, isLive: -1, createdAt: 1 },
        },
        // Paginate results
        { $skip: skip },
        { $limit: limit },
        // Project the required fields
        {
            $project: {
                _id: 1,
                name: 1,
                avatarURL: 1,
                contactNo1: 1,
                mainStation: 1,
                distance: 1,
                isLive: 1,
                isOnline: 1,
            },
        },
    ]);
    return riders;
});
const updateRider = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedRider = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updatedRider) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update rider!');
    }
    return updatedRider;
});
const updateLocation = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.liveLocation.timestamp = Date.now();
    const updatedRider = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updatedRider) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update rider!');
    }
    return null;
});
const getLocation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return user === null || user === void 0 ? void 0 : user.liveLocation;
});
exports.RiderServices = {
    getRiders,
    updateRider,
    updateLocation,
    getLocation,
};
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
