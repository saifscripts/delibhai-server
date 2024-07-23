import { z } from 'zod';

const credentialValidationSchema = z.object({
    body: z.object({
        mobile: z
            .string({
                required_error: 'Mobile number is required!',
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
    credentialValidationSchema,
    refreshTokenValidationSchema,
    changePasswordValidationSchema,
};
