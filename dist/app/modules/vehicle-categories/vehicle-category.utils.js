"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCategoryOrder = exports.createSlug = void 0;
const slugify_1 = __importDefault(require("slugify"));
const vehicle_category_model_1 = require("./vehicle-category.model");
const createSlug = (value) => (0, slugify_1.default)(value, {
    lower: true,
    strict: true,
    trim: true,
});
exports.createSlug = createSlug;
const generateCategoryOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastCategory = yield vehicle_category_model_1.VehicleCategory.findOne({}, { order: 1 }, { getAll: true }).sort({
        order: -1,
    });
    return lastCategory ? lastCategory.order + 1 : 0;
});
exports.generateCategoryOrder = generateCategoryOrder;
