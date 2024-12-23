"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("./user.constant");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router
    .route('/avatar')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.rider, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(user_validation_1.UserValidations.updateAvatarValidationSchema), user_controller_1.UserControllers.updateAvatar)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.rider, user_constant_1.USER_ROLE.admin), user_controller_1.UserControllers.deleteAvatar);
router.route('/:id').get(user_controller_1.UserControllers.getUser);
exports.UserRoutes = router;
