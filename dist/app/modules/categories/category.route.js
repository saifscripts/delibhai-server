"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VillageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(category_validation_1.VillageValidations.createVillagesValidationSchema), category_controller_1.VillageControllers.createVillages);
router
    .route('/:id')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(category_validation_1.VillageValidations.updateVillageValidationSchema), category_controller_1.VillageControllers.updateVillage)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.admin), category_controller_1.VillageControllers.deleteVillage);
router.route('/:unionId').get(category_controller_1.VillageControllers.getVillages);
exports.VillageRoutes = router;
