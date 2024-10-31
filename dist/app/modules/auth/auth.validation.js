"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const zod_1 = require("zod");
const createRiderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required!' })
            .trim()
            .min(3, 'Name must be at least 3 characters long!'),
        gender: zod_1.z
            .enum(['পুরুষ', 'মহিলা', 'অন্যান্য'], {
            invalid_type_error: 'Gender must be পুরুষ/মহিলা/অন্যান্য!',
        })
            .optional(),
        mobile: zod_1.z
            .string({ required_error: 'Mobile number is required!' })
            .trim()
            .refine((value) => validator_1.default.isMobilePhone(value, 'bn-BD'), {
            message: 'Invalid mobile number!',
        })
            .transform((value) => value.slice(-11)),
        password: zod_1.z.string({ required_error: 'Password is required!' }).refine((value) => validator_1.default.isStrongPassword(value, {
            minLength: 4,
            minLowercase: 0,
            minUppercase: 0,
            minNumbers: 0,
            minSymbols: 0,
        }), {
            message: 'Password must be at least 4 characters long!',
        }),
    }),
});
const verifyOTPValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        _id: zod_1.z
            .string({ required_error: 'ID is required!' })
            .refine((value) => mongoose_1.Types.ObjectId.isValid(value), {
            message: 'Invalid ObjectId',
        }),
        otp: zod_1.z.string({ required_error: 'OTP is required!' }),
    }),
});
const resendOTPValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        _id: zod_1.z
            .string({ required_error: 'ID is required!' })
            .refine((value) => mongoose_1.Types.ObjectId.isValid(value), {
            message: 'Invalid ObjectId',
        }),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        mobile: zod_1.z
            .string({ required_error: 'Mobile number is required!' })
            .trim()
            .refine((value) => validator_1.default.isMobilePhone(value, 'bn-BD'), {
            message: 'Invalid mobile number!',
        })
            .transform((value) => value.slice(-11)),
        password: zod_1.z.string({
            required_error: 'Password is required!',
        }),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'Old password is required!',
        }),
        newPassword: zod_1.z
            .string({ required_error: 'New password is required!' })
            .refine((value) => validator_1.default.isStrongPassword(value, {
            minLength: 4,
            minLowercase: 0,
            minUppercase: 0,
            minNumbers: 0,
            minSymbols: 0,
        }), {
            message: 'Password must be at least 4 characters long!',
        }),
    }),
});
exports.AuthValidations = {
    createRiderValidationSchema,
    verifyOTPValidationSchema,
    resendOTPValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
    changePasswordValidationSchema,
};
