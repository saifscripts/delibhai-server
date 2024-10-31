"use strict";
// import { isMobilePhone, isStrongPassword } from 'validator';
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const updateAvatarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        avatarURL: zod_1.z.string().url('Invalid url').optional(),
        avatarOriginURL: zod_1.z.string().url('Invalid url').optional(),
        avatarCropData: zod_1.z
            .object({
            unit: zod_1.z.string(),
            x: zod_1.z.number(),
            y: zod_1.z.number(),
            width: zod_1.z.number(),
            height: zod_1.z.number(),
        }, { invalid_type_error: 'Invalid crop data' })
            .optional(),
    }),
});
exports.UserValidations = {
    updateAvatarValidationSchema,
};
