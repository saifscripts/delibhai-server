"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VillageValidations = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const village_utils_1 = require("./village.utils");
const createVillagesValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        villages: zod_1.z
            .array(zod_1.z.object({
            unionId: zod_1.z
                .string({ required_error: 'UnionID is required!' })
                .refine((value) => mongoose_1.Types.ObjectId.isValid(value), {
                message: 'Invalid UnionID',
            }),
            wardId: zod_1.z
                .string({
                required_error: 'WardID is required!',
            })
                .min(1, 'WardID is required!')
                .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
                message: 'Invalid WardID',
            }),
            title: zod_1.z
                .string({
                required_error: 'Title is required!',
            })
                .trim()
                .min(1, 'Title is required!'),
        }))
            .min(1, 'Village is required')
            .refine((villages) => !(0, village_utils_1.hasDuplicateUnionIdAndTitle)(villages), 'Duplicate village exists'),
    }),
});
const updateVillageValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'Title is required!',
        })
            .trim()
            .min(1, 'Title is required!'),
    }),
});
exports.VillageValidations = {
    createVillagesValidationSchema,
    updateVillageValidationSchema,
};
