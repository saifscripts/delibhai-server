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
exports.VehicleCategoryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const vehicle_category_service_1 = require("./vehicle-category.service");
const createVehicleCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_category_service_1.VehicleCategoryServices.createVehicleCategory(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'Successfully created vehicle category!',
        data: result,
    });
}));
// const updateVehicleCategory = catchAsync(async (req, res) => {
//     const result = await VehicleCategoryServices.updateVehicleCategory(
//         req.params.id,
//         req.body,
//     );
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Successfully updated the village!',
//         data: result,
//     });
// });
// const deleteVehicleCategory = catchAsync(async (req, res) => {
//     const result = await VehicleCategoryServices.deleteVehicleCategory(
//         req.params.id,
//     );
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Successfully deleted the village!',
//         data: result,
//     });
// });
// const getVehicleCategories = catchAsync(async (req, res) => {
//     const result = await VehicleCategoryServices.getVehicleCategories(
//         req.params.unionId,
//         req.query,
//     );
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Successfully fetched villages!',
//         data: result,
//     });
// });
exports.VehicleCategoryControllers = {
    createVehicleCategory,
    // updateVehicleCategory,
    // deleteVehicleCategory,
    // getVehicleCategories,
};
