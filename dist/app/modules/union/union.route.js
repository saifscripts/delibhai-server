"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const union_controller_1 = require("./union.controller");
const router = express_1.default.Router();
router.route('/:upazilaId').get(union_controller_1.UnionControllers.getUnions);
exports.UnionRoutes = router;
