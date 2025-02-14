import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { VehicleCategoryControllers } from './vehicle-category.controller';
import { VehicleCategoryValidations } from './vehicle-category.validation';

const router = express.Router();

router
    .route('/')
    .post(
        auth(USER_ROLE.admin),
        validateRequest(
            VehicleCategoryValidations.createVehicleCategoryValidationSchema,
        ),
        VehicleCategoryControllers.createVehicleCategory,
    );

export const VehicleCategoryRoutes = router;
