import { z } from 'zod';
import { createSlug } from './vehicle-category.utils';

const createVehicleCategoryValidationSchema = z.object({
    body: z.object({
        icon: z.string().url('Invalid icon url'),
        title: z.string().trim().min(1, 'Title is required!'),
        title_en: z.string().trim().min(1, 'English Title is required!'),
        slug: z
            .string()
            .optional()
            .transform((value) => (value ? createSlug(value) : undefined)),
    }),
});

export const VehicleCategoryValidations = {
    createVehicleCategoryValidationSchema,
    // updateVillageValidationSchema,
};
