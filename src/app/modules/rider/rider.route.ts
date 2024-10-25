import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { RiderControllers } from './rider.controller';
import { RiderValidations } from './rider.validation';

const router = express.Router();

router
    .route('/')
    .get(RiderControllers.getRiders)
    .put(
        auth(USER_ROLE.rider),
        validateRequest(RiderValidations.updateRiderValidationSchema),
        RiderControllers.updateRider,
    );

router
    .route('/location')
    // .get(RiderControllers.getRiders)
    .put(
        auth(USER_ROLE.rider),
        validateRequest(RiderValidations.updateLocationValidationSchema),
        RiderControllers.updateLocation,
    );

export const RiderRoutes = router;
