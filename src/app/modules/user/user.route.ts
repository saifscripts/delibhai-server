import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router.post(
    '/create-rider',
    validateRequest(UserValidations.createRiderValidationSchema),
    UserControllers.createRider,
);

router.post(
    '/create-rider/verify-otp',
    validateRequest(UserValidations.verifyOTPValidationSchema),
    UserControllers.verifyRiderOTP,
);

export const UserRoutes = router;
