import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RiderControllers } from './rider.controller';
import { RiderValidations } from './rider.validation';

const router = express.Router();

router
    .route('/signup')
    .post(
        validateRequest(RiderValidations.createRiderValidationSchema),
        RiderControllers.createRider,
    );

router
    .route('/verify-otp')
    .post(
        validateRequest(RiderValidations.verifyOTPValidationSchema),
        RiderControllers.verifyOTP,
    );

router.put(
    '/:id',
    validateRequest(RiderValidations.updateRiderValidationSchema),
    RiderControllers.updateRider,
);

export const RiderRoutes = router;
