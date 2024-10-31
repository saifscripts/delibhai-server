"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const division_controller_1 = require("./division.controller");
const router = express_1.default.Router();
router.route('/').get(division_controller_1.DivisionControllers.getAllDivisions);
exports.DivisionRoutes = router;
