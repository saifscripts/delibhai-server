import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { RiderControllers } from './rider.controller';
import { RiderValidations } from './rider.validation';

const router = express.Router();

router
    .route('/')
    .get(
        validateRequest(RiderValidations.getRidersValidationSchema),
        RiderControllers.getRiders,
    )
    .put(
        auth(USER_ROLE.rider, USER_ROLE.admin),
        validateRequest(RiderValidations.updateRiderValidationSchema),
        RiderControllers.updateRider,
    );

router
    .route('/location')
    .put(
        auth(USER_ROLE.rider, USER_ROLE.admin),
        validateRequest(RiderValidations.updateLocationValidationSchema),
        RiderControllers.updateLocation,
    );

router.route('/location/:id').get(RiderControllers.getLocation);

export const RiderRoutes = router;
