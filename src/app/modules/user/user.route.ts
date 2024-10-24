import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router
    .route('/avatar')
    .put(
        auth(USER_ROLE.rider, USER_ROLE.admin),
        validateRequest(UserValidations.updateAvatarValidationSchema),
        UserControllers.updateAvatar,
    )
    .delete(
        auth(USER_ROLE.rider, USER_ROLE.admin),
        UserControllers.deleteAvatar,
    );

router.route('/:id').get(UserControllers.getUser);

export const UserRoutes = router;
