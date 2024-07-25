// import { isMobilePhone, isStrongPassword } from 'validator';

import { Types } from 'mongoose';
import { z } from 'zod';

// remove this function. import from 'validator' instead
const isMobilePhone = (mobile: string, locale = 'bn-BD') => {
    if (locale !== 'bn-BD') return false;

    const slicedMobile = mobile.slice(-11);

    if (slicedMobile.startsWith('01') && isNaN(Number(slicedMobile))) {
        return true;
    }

    return true;
};

// remove this function. import from 'validator' instead
const isStrongPassword = (
    password: string,
    options: {
        minLength: number;
        minLowercase?: number;
        minNumbers?: number;
        minUppercase?: number;
        minSymbols?: number;
    } = { minLength: 4 },
) => {
    if (password.length >= options?.minLength) return true;

    return false;
};

const objectId = z
    .string({ required_error: 'ID is required!' })
    .refine((value) => Types.ObjectId.isValid(value), {
        message: 'Invalid ObjectId',
    });

const addressSchema = z.object({
    division: objectId,
    district: objectId,
    upazila: objectId,
    union: objectId,
    village: objectId,
});

const areaSchema = z.object({
    division: objectId.optional(),
    district: objectId.optional(),
    upazila: objectId.optional(),
    union: objectId.optional(),
    village: z.array(objectId).optional(),
});

const liveLocationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    timestamp: z.number(),
});
const manualLocationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

const createRiderValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required!' })
            .trim()
            .min(3, 'Name must be at least 3 characters long!'),
        gender: z
            .enum(['পুরুষ', 'মহিলা', 'অন্যান্য'], {
                invalid_type_error: 'Gender must be পুরুষ/মহিলা/অন্যান্য!',
            })
            .optional(),
        mobile: z
            .string({ required_error: 'Mobile number is required!' })
            .trim()
            .refine((value) => isMobilePhone(value, 'bn-BD'), {
                message: 'Invalid mobile number!',
            }),
        password: z.string({ required_error: 'Password is required!' }).refine(
            (value) =>
                isStrongPassword(value, {
                    minLength: 4,
                    minLowercase: 0,
                    minNumbers: 0,
                    minUppercase: 0,
                    minSymbols: 0,
                }),
            {
                message: 'Password must be at least 4 characters long!',
            },
        ),
    }),
});

const verifyOTPValidationSchema = z.object({
    body: z.object({
        _id: z
            .string({ required_error: 'ID is required!' })
            .refine((value) => Types.ObjectId.isValid(value), {
                message: 'Invalid ObjectId',
            }),
        otp: z.string({ required_error: 'OTP is required!' }),
    }),
});

const updateRiderValidationSchema = z.object({
    body: z.object({
        contactNo1: z
            .string()
            .trim()
            .refine((value) => isMobilePhone(value, 'bn-BD'), {
                message: 'Invalid mobile number!',
            })
            .optional(),
        contactNo2: z
            .string()
            .trim()
            .refine((value) => isMobilePhone(value, 'bn-BD'), {
                message: 'Invalid mobile number!',
            })
            .optional(),
        email: z.string().email('Invalid email!').optional(),
        facebookURL: z.string().url('Invalid URL!').optional(),
        presentAddress: addressSchema.optional(),
        permanentAddress: addressSchema.optional(),
        vehicleType: z.string().trim().optional(),
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
            .enum(
                [
                    'লোকাল ভাড়া',
                    'রিজার্ভ ভাড়া',
                    'লোকাল ও রিজার্ভ ভাড়া',
                    'কন্টাক্ট ভাড়া',
                ],
                {
                    invalid_type_error: 'Invalid rent type!',
                },
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
        liveLocation: liveLocationSchema.optional(),
        manualLocation: manualLocationSchema.optional(),
        videoURL: z.string().url('Invalid URL!').optional(),
    }),
});

export const RiderValidations = {
    createRiderValidationSchema,
    updateRiderValidationSchema,
    verifyOTPValidationSchema,
};
