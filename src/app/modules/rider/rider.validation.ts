import { z } from 'zod';

const createRiderValidationSchema = z.object({
    body: z.object({
        contactNo1: z.string(),
    }),
});

const updateRiderValidationSchema = z.object({
    body: z.object({
        contactNo1: z.string().optional(),
    }),
});

export const RiderValidations = {
    createRiderValidationSchema,
    updateRiderValidationSchema,
};
