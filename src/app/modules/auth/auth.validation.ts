import { z } from 'zod';

const credentialValidationSchema = z.object({
    body: z.object({
        id: z.string({
            required_error: 'ID is required',
        }),
        password: z.string({
            required_error: 'Password is required',
        }),
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            required_error: 'Old password is required',
        }),
        newPassword: z.string({
            required_error: 'New password is required',
        }),
    }),
});

export const AuthValidations = {
    credentialValidationSchema,
    refreshTokenValidationSchema,
    changePasswordValidationSchema,
};
