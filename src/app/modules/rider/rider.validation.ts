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

const locationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

const updateRiderValidationSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(3, 'Name must be at least 3 characters long!')
            .optional(),
        fatherName: z
            .string()
            .trim()
            .min(3, 'Name must be at least 3 characters long!')
            .optional(),
        gender: z
            .enum(['পুরুষ', 'মহিলা', 'অন্যান্য'], {
                invalid_type_error: 'Gender must be পুরুষ/মহিলা/অন্যান্য!',
            })
            .optional(),
        bloodGroup: z
            .enum(['এ+', 'বি+', 'এবি+', 'ও+', 'এ-', 'বি-', 'এবি-', 'ও-'], {
                invalid_type_error: 'Invalid blood group!',
            })
            .optional(),
        dateOfBirth: z.string().date('Invalid date of birth!').optional(),
        nid: z
            .string()
            .refine((value) => isNID(value), {
                message: 'Invalid NID number!',
            })
            .optional(),
        nidURL: z.string().url('Invalid NID URL').optional(),
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
    updateRiderValidationSchema,
    updateLocationValidationSchema,
};
