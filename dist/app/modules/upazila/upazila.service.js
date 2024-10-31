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
exports.UpazilaServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const upazila_model_1 = require("./upazila.model");
const getUpazilas = (districtId) => __awaiter(void 0, void 0, void 0, function* () {
    const upazilas = yield upazila_model_1.Upazila.find({ districtId });
    if (!upazilas.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No upazila found!');
    }
    return upazilas;
});
exports.UpazilaServices = {
    getUpazilas,
};
