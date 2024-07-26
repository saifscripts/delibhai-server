import { Types } from 'mongoose';
import { z } from 'zod';

const createVillageValidationSchema = z.object({
    body: z.object({
        unionId: z
            .string({ required_error: 'ID is required!' })
            .refine((value) => Types.ObjectId.isValid(value), {
                message: 'Invalid ObjectId',
            }),
        wardNo: z
            .string({
                required_error: 'Ward is required!',
            })
            .min(1, 'Ward is required!')
            .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
                message: 'Ward number must be a positive number',
            }),
        title: z
            .string({
                required_error: 'Title is required!',
            })
            .min(1, 'Title is required!'),
    }),
});

export const VillageValidations = {
    createVillageValidationSchema,
};
