import { Types } from 'mongoose';
import { z } from 'zod';

const createVillagesValidationSchema = z.object({
    body: z.object({
        villages: z
            .array(
                z.object({
                    unionId: z
                        .string({ required_error: 'UnionID is required!' })
                        .refine((value) => Types.ObjectId.isValid(value), {
                            message: 'Invalid UnionID',
                        }),
                    wardId: z
                        .string({
                            required_error: 'WardID is required!',
                        })
                        .min(1, 'WardID is required!')
                        .refine(
                            (val) =>
                                !Number.isNaN(Number(val)) && Number(val) > 0,
                            {
                                message: 'Invalid WardID',
                            },
                        ),
                    title: z
                        .string({
                            required_error: 'Title is required!',
                        })
                        .trim()
                        .min(1, 'Title is required!'),
                }),
            )
            .min(1, 'Village is required'),
    }),
});

const updateVillageValidationSchema = z.object({
    body: z.object({
        title: z
            .string({
                required_error: 'Title is required!',
            })
            .trim()
            .min(1, 'Title is required!'),
    }),
});

export const VillageValidations = {
    createVillagesValidationSchema,
    updateVillageValidationSchema,
};
