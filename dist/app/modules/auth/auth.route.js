"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router
    .route('/register-rider')
    .post((0, validateRequest_1.default)(auth_validation_1.AuthValidations.createRiderValidationSchema), auth_controller_1.AuthControllers.createRider);
router
    .route('/verify-otp')
    .post((0, validateRequest_1.default)(auth_validation_1.AuthValidations.verifyOTPValidationSchema), auth_controller_1.AuthControllers.verifyOTP);
router
    .route('/resend-otp')
    .post((0, validateRequest_1.default)(auth_validation_1.AuthValidations.resendOTPValidationSchema), auth_controller_1.AuthControllers.resendOTP);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.loginValidationSchema), auth_controller_1.AuthControllers.login);
router.get('/me', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.rider), auth_controller_1.AuthControllers.getMe);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidations.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
router.put('/change-password', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.rider), (0, validateRequest_1.default)(auth_validation_1.AuthValidations.changePasswordValidationSchema), auth_controller_1.AuthControllers.changePassword);
exports.AuthRoutes = router;
