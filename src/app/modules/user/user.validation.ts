// import { isMobilePhone, isStrongPassword } from 'validator';

import { z } from 'zod';

const updateAvatarValidationSchema = z.object({
    body: z.object({
        avatarURL: z.string().url('Invalid url').optional(),
        avatarOriginURL: z.string().url('Invalid url').optional(),
        avatarCropData: z
            .object(
                {
                    unit: z.string(),
                    x: z.number(),
                    y: z.number(),
                    width: z.number(),
                    height: z.number(),
                },
                { invalid_type_error: 'Invalid crop data' },
            )
            .optional(),
    }),
});

export const UserValidations = {
    updateAvatarValidationSchema,
};
