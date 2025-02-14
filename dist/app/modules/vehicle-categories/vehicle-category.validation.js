"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleCategoryValidations = void 0;
const zod_1 = require("zod");
const vehicle_category_utils_1 = require("./vehicle-category.utils");
const createVehicleCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        icon: zod_1.z.string().url('Invalid icon url'),
        title: zod_1.z.string().trim().min(1, 'Title is required!'),
        title_en: zod_1.z.string().trim().min(1, 'English Title is required!'),
        slug: zod_1.z
            .string()
            .optional()
            .transform((value) => (value ? (0, vehicle_category_utils_1.createSlug)(value) : undefined)),
    }),
});
exports.VehicleCategoryValidations = {
    createVehicleCategoryValidationSchema,
    // updateVillageValidationSchema,
};
