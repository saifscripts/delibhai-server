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
exports.VehicleCategoryServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const vehicle_category_model_1 = require("./vehicle-category.model");
const vehicle_category_utils_1 = require("./vehicle-category.utils");
const createVehicleCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newCategory = yield vehicle_category_model_1.VehicleCategory.create(Object.assign(Object.assign({}, payload), { slug: payload.slug || (0, vehicle_category_utils_1.createSlug)(payload.title_en), order: yield (0, vehicle_category_utils_1.generateCategoryOrder)() }));
    if (!newCategory) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create Vehicle Category');
    }
    return newCategory;
});
// const updateVehicleCategory = async (
//     id: string,
//     payload: Partial<IVehicleCategory>,
// ) => {};
// const deleteVehicleCategory = async (id: string) => {};
// const getVehicleCategories = async (query: Record<string, unknown>) => {};
exports.VehicleCategoryServices = {
    createVehicleCategory,
    // updateVehicleCategory,
    // deleteVehicleCategory,
    // getVehicleCategories,
};
