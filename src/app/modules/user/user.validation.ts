// import { isMobilePhone, isStrongPassword } from 'validator';

import { z } from 'zod';
import { isNID } from './user.util';

const updateUserValidationSchema = z.object({
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
    }),
});

export const UserValidations = {
    updateUserValidationSchema,
};
