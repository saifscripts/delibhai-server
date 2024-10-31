"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictRoutes = void 0;
const express_1 = __importDefault(require("express"));
const district_controller_1 = require("./district.controller");
const router = express_1.default.Router();
router.route('/:divisionId').get(district_controller_1.DistrictControllers.getDistricts);
exports.DistrictRoutes = router;
