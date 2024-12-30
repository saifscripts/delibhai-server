"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const rider_controller_1 = require("./rider.controller");
const rider_validation_1 = require("./rider.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, validateRequest_1.default)(rider_validation_1.RiderValidations.getRidersValidationSchema), rider_controller_1.RiderControllers.getRiders)
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.rider, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(rider_validation_1.RiderValidations.updateRiderValidationSchema), rider_controller_1.RiderControllers.updateRider);
router
    .route('/service-area')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.rider, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(rider_validation_1.RiderValidations.addServiceAreaValidationSchema), rider_controller_1.RiderControllers.addServiceArea);
router
    .route('/service-area/:id')
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.rider, user_constant_1.USER_ROLE.admin), rider_controller_1.RiderControllers.deleteServiceArea);
router
    .route('/location')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.rider, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(rider_validation_1.RiderValidations.updateLocationValidationSchema), rider_controller_1.RiderControllers.updateLocation);
router.route('/location/:id').get(rider_controller_1.RiderControllers.getLocation);
exports.RiderRoutes = router;
