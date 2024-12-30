"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderValidations = exports.FlexibleAddressSchema = exports.StrictAddressSchema = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
const zod_1 = require("zod");
const validators_1 = require("../../utils/validators");
const user_constant_1 = require("../user/user.constant");
const ObjectId = zod_1.z
    .string({ required_error: 'ID is required!' })
    .refine((value) => mongoose_1.Types.ObjectId.isValid(value), {
    message: 'Invalid ObjectId',
});
const AreaSchema = zod_1.z.object({
    division: zod_1.z.object({ title: zod_1.z.string(), _id: ObjectId }).optional(),
    district: zod_1.z.object({ title: zod_1.z.string(), _id: ObjectId }).optional(),
    upazila: zod_1.z.object({ title: zod_1.z.string(), _id: ObjectId }).optional(),
    union: zod_1.z.object({ title: zod_1.z.string(), _id: ObjectId }).optional(),
    village: zod_1.z.array(zod_1.z.object({ title: zod_1.z.string(), _id: ObjectId })).optional(),
});
exports.StrictAddressSchema = zod_1.z.object({
    division: zod_1.z.object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    }, { required_error: 'Division is required' }),
    district: zod_1.z.object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    }, { required_error: 'District is required' }),
    upazila: zod_1.z.object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    }, { required_error: 'Upazila is required' }),
    union: zod_1.z.object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    }, { required_error: 'Union is required' }),
    village: zod_1.z
        .object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    })
        .optional(),
});
exports.FlexibleAddressSchema = zod_1.z.object({
    division: zod_1.z
        .object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    })
        .optional(),
    district: zod_1.z
        .object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    })
        .optional(),
    upazila: zod_1.z
        .object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    })
        .optional(),
    union: zod_1.z
        .object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    })
        .optional(),
    village: zod_1.z
        .object({
        _id: zod_1.z.string(),
        title: zod_1.z.string(),
    })
        .optional(),
});
const LocationSchema = zod_1.z.object({
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
});
const getRidersValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        vehicleType: zod_1.z
            .string({ required_error: 'Vehicle type is required!' })
            .trim(),
        vehicleSubType: zod_1.z.string().trim().optional(),
        rentType: zod_1.z
            .string()
            .trim()
            .optional()
            .transform((value) => value && value.split(',')),
        latitude: zod_1.z
            .string({ required_error: 'Latitude is required!' })
            .transform((value) => parseFloat(value)),
        longitude: zod_1.z
            .string({ required_error: 'Longitude is required!' })
            .transform((value) => parseFloat(value)),
        limit: zod_1.z
            .string()
            .default('10')
            .transform((value) => parseInt(value)),
        page: zod_1.z
            .string()
            .default('1')
            .transform((value) => parseInt(value)),
    }),
});
const updateRiderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required!' })
            .trim()
            .min(1, 'Name is required!')
            .min(3, 'Name must be at least 3 characters long!')
            .optional(),
        fatherName: zod_1.z
            .string()
            .trim()
            .transform((val) => (val === '' ? null : val))
            .refine((value) => value === null || value.length > 3, {
            message: "Father's name must be at least 3 characters long!",
        })
            .nullable()
            .optional(),
        gender: zod_1.z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine((val) => val === null ||
            zod_1.z.enum(['পুরুষ', 'মহিলা', 'অন্যান্য']).safeParse(val)
                .success, {
            message: 'Gender must be পুরুষ/মহিলা/অন্যান্য!',
        })
            .nullable()
            .optional(),
        bloodGroup: zod_1.z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine((val) => val === null ||
            zod_1.z
                .enum([
                'এ+',
                'বি+',
                'এবি+',
                'ও+',
                'এ-',
                'বি-',
                'এবি-',
                'ও-',
            ])
                .safeParse(val).success, {
            message: 'Invalid blood group!',
        })
            .nullable()
            .optional(),
        dateOfBirth: zod_1.z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine((val) => val === null || zod_1.z.string().date().safeParse(val).success, {
            message: 'Invalid date of birth!',
        })
            .nullable()
            .optional(),
        nid: zod_1.z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine((val) => val === null || (0, validators_1.isNID)(val), {
            message: 'Invalid NID number!',
        })
            .nullable()
            .optional(),
        nidURL: zod_1.z.string().url('Invalid NID URL').nullish().optional(),
        contactNo1: zod_1.z
            .string()
            .trim()
            .min(1, 'Mobile number is required!')
            .refine(validator_1.isMobilePhone, {
            message: 'Invalid mobile number!',
        })
            .optional(),
        contactNo2: zod_1.z
            .string()
            .trim()
            .transform((val) => (val === '' ? null : val))
            .refine((val) => val === null || (0, validator_1.isMobilePhone)(val), {
            message: 'Invalid mobile number!',
        })
            .nullable()
            .optional(),
        email: zod_1.z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine((val) => val === null || zod_1.z.string().email().safeParse(val).success, {
            message: 'Invalid email!',
        })
            .nullable()
            .optional(),
        facebookURL: zod_1.z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine((val) => val === null || zod_1.z.string().url().safeParse(val).success, {
            message: 'Invalid URL!',
        })
            .nullable()
            .optional(),
        presentAddress: exports.FlexibleAddressSchema.optional(),
        permanentAddress: exports.FlexibleAddressSchema.optional(),
        vehicleType: zod_1.z.string().trim().optional(),
        vehicleSubType: zod_1.z.string().trim().optional(),
        vehicleBrand: zod_1.z.string().trim().optional(),
        vehicleModel: zod_1.z.string().trim().optional(),
        vehicleNumber: zod_1.z.string().trim().optional(),
        vehicleName: zod_1.z.string().trim().optional(),
        ownerName: zod_1.z
            .string()
            .trim()
            .min(3, 'Name must be at least 3 characters long!')
            .optional(),
        ownerAddress: exports.FlexibleAddressSchema.optional(),
        ownerContactNo: zod_1.z
            .string()
            .trim()
            .refine((value) => (0, validator_1.isMobilePhone)(value, 'bn-BD'), {
            message: 'Invalid mobile number!',
        })
            .optional(),
        ownerEmail: zod_1.z.string().email('Invalid email!').optional(),
        vehiclePhotos: zod_1.z
            .array(zod_1.z.string().url('Invalid URL!'))
            .max(4, 'Photos exceeded the limit of 4!')
            .optional(),
        serviceType: zod_1.z
            .enum(['ব্যক্তিগত', 'ভাড়ায় চালিত'], {
            invalid_type_error: 'Invalid service type!',
        })
            .optional(),
        rentType: zod_1.z
            .array(zod_1.z.enum(user_constant_1.RentType, {
            invalid_type_error: 'Invalid rent type!',
        }))
            .optional(),
        mainStation: exports.StrictAddressSchema.optional(),
        serviceArea: zod_1.z.array(AreaSchema).optional(),
        serviceTimeSlots: zod_1.z
            .array(zod_1.z.object({ start: zod_1.z.string(), end: zod_1.z.string() }))
            .optional(),
        serviceStatus: zod_1.z
            .enum(user_constant_1.ServiceStatus, {
            invalid_type_error: 'Invalid service status!',
        })
            .optional(),
        manualLocation: LocationSchema.optional(),
        videoURL: zod_1.z.string().url('Invalid URL!').optional(),
    }),
});
const updateLocationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        liveLocation: LocationSchema,
    }),
});
const addServiceAreaValidationSchema = zod_1.z.object({
    body: AreaSchema,
});
exports.RiderValidations = {
    getRidersValidationSchema,
    updateRiderValidationSchema,
    updateLocationValidationSchema,
    addServiceAreaValidationSchema,
};
