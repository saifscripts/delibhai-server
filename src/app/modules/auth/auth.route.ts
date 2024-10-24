import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { AuthControllers } from './auth.controller';
import { AuthValidations } from './auth.validation';

const router = express.Router();

router
    .route('/create-rider')
    .post(
        validateRequest(AuthValidations.createRiderValidationSchema),
        AuthControllers.createRider,
    );

router
    .route('/verify-otp')
    .post(
        validateRequest(AuthValidations.verifyOTPValidationSchema),
        AuthControllers.verifyOTP,
    );

router
    .route('/resend-otp')
    .post(
        validateRequest(AuthValidations.resendOTPValidationSchema),
        AuthControllers.resendOTP,
    );

router.post(
    '/login',
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.login,
);

router.get(
    '/me',
    auth(USER_ROLE.admin, USER_ROLE.rider),
    AuthControllers.getMe,
);

router.post(
    '/refresh-token',
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

router.put(
    '/change-password',
    auth(USER_ROLE.admin, USER_ROLE.rider),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

export const AuthRoutes = router;
