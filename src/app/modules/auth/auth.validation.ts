import { Types } from 'mongoose';
import validator from 'validator';
import { z } from 'zod';

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
            .refine((value) => validator.isMobilePhone(value, 'bn-BD'), {
                message: 'Invalid mobile number!',
            })
            .transform((value) => value.slice(-11)),
        password: z.string({ required_error: 'Password is required!' }).refine(
            (value) =>
                validator.isStrongPassword(value, {
                    minLength: 4,
                    minLowercase: 0,
                    minUppercase: 0,
                    minNumbers: 0,
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

const loginValidationSchema = z.object({
    body: z.object({
        mobile: z
            .string({ required_error: 'Mobile number is required!' })
            .trim()
            .refine((value) => validator.isMobilePhone(value, 'bn-BD'), {
                message: 'Invalid mobile number!',
            })
            .transform((value) => value.slice(-11)),
        password: z.string({
            required_error: 'Password is required!',
        }),
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            required_error: 'Old password is required!',
        }),
        newPassword: z.string({
            required_error: 'New password is required!',
        }),
    }),
});

export const AuthValidations = {
    createRiderValidationSchema,
    verifyOTPValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
    changePasswordValidationSchema,
};
