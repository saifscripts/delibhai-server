import { z } from 'zod';

const createVehicleCategoryValidationSchema = z.object({
    body: z.object({
        icon: z.string().url('Invalid icon url'),
        title: z.string().trim().min(1, 'Title is required!'),
        title_en: z.string().trim().min(1, 'English Title is required!'),
        slug: z.string().trim().min(1, 'Slug is required!'),
        order: z.number({ required_error: 'Order is required!' }),
    }),
});

export const VehicleCategoryValidations = {
    createVehicleCategoryValidationSchema,
    // updateVillageValidationSchema,
};
