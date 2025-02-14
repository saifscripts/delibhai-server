"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const vehicle_category_controller_1 = require("./vehicle-category.controller");
const vehicle_category_validation_1 = require("./vehicle-category.validation");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(vehicle_category_validation_1.VehicleCategoryValidations.createVehicleCategoryValidationSchema), vehicle_category_controller_1.VehicleCategoryControllers.createVehicleCategory);
exports.VehicleCategoryRoutes = router;
