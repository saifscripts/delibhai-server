import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router
    .route('/')
    .put(
        auth(USER_ROLE.rider),
        validateRequest(UserValidations.updateUserValidationSchema),
        UserControllers.updateSingleUser,
    );

export const UserRoutes = router;
