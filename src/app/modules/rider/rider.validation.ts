import { Types } from 'mongoose';
import { isMobilePhone } from 'validator';
import { z } from 'zod';
import { isNID } from '../../utils/validators';

const objectId = z
    .string({ required_error: 'ID is required!' })
    .refine((value) => Types.ObjectId.isValid(value), {
        message: 'Invalid ObjectId',
    });

const addressSchema = z.object({
    division: z.object({ title: z.string(), _id: objectId }).optional(),
    district: z.object({ title: z.string(), _id: objectId }).optional(),
    upazila: z.object({ title: z.string(), _id: objectId }).optional(),
    union: z.object({ title: z.string(), _id: objectId }).optional(),
    village: z.object({ title: z.string(), _id: objectId }).optional(),
});

const areaSchema = z.object({
    division: z.object({ title: z.string(), _id: objectId }).optional(),
    district: z.object({ title: z.string(), _id: objectId }).optional(),
    upazila: z.object({ title: z.string(), _id: objectId }).optional(),
    union: z.object({ title: z.string(), _id: objectId }).optional(),
    village: z.array(z.object({ title: z.string(), _id: objectId })).optional(),
});

const locationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

const getRidersValidationSchema = z.object({
    query: z.object({
        vehicleType: z
            .string({ required_error: 'Vehicle type is required!' })
            .trim(),
        vehicleSubType: z.string().trim().optional(),
        latitude: z
            .string({ required_error: 'Latitude is required!' })
            .transform((value) => parseFloat(value)),
        longitude: z
            .string({ required_error: 'Longitude is required!' })
            .transform((value) => parseFloat(value)),
        limit: z
            .string()
            .default('10')
            .transform((value) => parseInt(value)),
        page: z
            .string()
            .default('1')
            .transform((value) => parseInt(value)),
    }),
});

const updateRiderValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required!' })
            .trim()
            .min(1, 'Name is required!')
            .min(3, 'Name must be at least 3 characters long!')
            .optional(),
        fatherName: z
            .string()
            .trim()
            .transform((val) => (val === '' ? null : val))
            .refine((value) => value === null || value.length > 3, {
                message: "Father's name must be at least 3 characters long!",
            })
            .nullable()
            .optional(),
        gender: z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine(
                (val) =>
                    val === null ||
                    z.enum(['পুরুষ', 'মহিলা', 'অন্যান্য']).safeParse(val)
                        .success,
                {
                    message: 'Gender must be পুরুষ/মহিলা/অন্যান্য!',
                },
            )
            .nullable()
            .optional(),
        bloodGroup: z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine(
                (val) =>
                    val === null ||
                    z
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
                        .safeParse(val).success,
                {
                    message: 'Invalid blood group!',
                },
            )
            .nullable()
            .optional(),
        dateOfBirth: z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine(
                (val) =>
                    val === null || z.string().date().safeParse(val).success,
                {
                    message: 'Invalid date of birth!',
                },
            )
            .nullable()
            .optional(),
        nid: z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine((val) => val === null || isNID(val), {
                message: 'Invalid NID number!',
            })
            .nullable()
            .optional(),
        nidURL: z.string().url('Invalid NID URL').nullish().optional(),
        contactNo1: z
            .string()
            .trim()
            .min(1, 'Mobile number is required!')
            .refine(isMobilePhone, {
                message: 'Invalid mobile number!',
            })
            .optional(),
        contactNo2: z
            .string()
            .trim()
            .transform((val) => (val === '' ? null : val))
            .refine((val) => val === null || isMobilePhone(val), {
                message: 'Invalid mobile number!',
            })
            .nullable()
            .optional(),
        email: z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine(
                (val) =>
                    val === null || z.string().email().safeParse(val).success,
                {
                    message: 'Invalid email!',
                },
            )
            .nullable()
            .optional(),
        facebookURL: z
            .string()
            .transform((val) => (val === '' ? null : val))
            .refine(
                (val) =>
                    val === null || z.string().url().safeParse(val).success,
                {
                    message: 'Invalid URL!',
                },
            )
            .nullable()
            .optional(),
        presentAddress: addressSchema.optional(),
        permanentAddress: addressSchema.optional(),
        vehicleType: z.string().trim().optional(),
        vehicleSubType: z.string().trim().optional(),
        vehicleBrand: z.string().trim().optional(),
        vehicleModel: z.string().trim().optional(),
        vehicleNumber: z.string().trim().optional(),
        vehicleName: z.string().trim().optional(),
        ownerName: z
            .string()
            .trim()
            .min(3, 'Name must be at least 3 characters long!')
            .optional(),
        ownerAddress: addressSchema.optional(),
        ownerContactNo: z
            .string()
            .trim()
            .refine((value) => isMobilePhone(value, 'bn-BD'), {
                message: 'Invalid mobile number!',
            })
            .optional(),
        ownerEmail: z.string().email('Invalid email!').optional(),
        vehiclePhotos: z
            .array(z.string().url('Invalid URL!'))
            .max(4, 'Photos exceeded the limit of 4!')
            .optional(),
        serviceType: z
            .enum(['ব্যক্তিগত', 'ভাড়ায় চালিত'], {
                invalid_type_error: 'Invalid service type!',
            })
            .optional(),
        rentType: z
            .array(
                z.enum(['লোকাল', 'রিজার্ভ', 'কন্টাক্ট'], {
                    invalid_type_error: 'Invalid rent type!',
                }),
            )
            .optional(),
        mainStation: addressSchema.optional(),
        serviceArea: z.array(areaSchema).optional(),
        serviceTimeSlots: z
            .array(z.object({ start: z.string(), end: z.string() }))
            .optional(),
        serviceStatus: z
            .enum(['off', 'scheduled', 'on'], {
                invalid_type_error: 'Invalid service status!',
            })
            .optional(),
        manualLocation: locationSchema.optional(),
        videoURL: z.string().url('Invalid URL!').optional(),
    }),
});

const updateLocationValidationSchema = z.object({
    body: z.object({
        liveLocation: locationSchema,
    }),
});

export const RiderValidations = {
    getRidersValidationSchema,
    updateRiderValidationSchema,
    updateLocationValidationSchema,
};
