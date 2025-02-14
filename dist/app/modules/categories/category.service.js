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
exports.VillageServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const category_model_1 = require("./category.model");
const createVillages = (villages) => __awaiter(void 0, void 0, void 0, function* () {
    const existingVillages = yield category_model_1.Village.find({
        $or: villages.map((village) => ({
            unionId: village.unionId,
            title: village.title,
        })),
    });
    if (existingVillages.length) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'One or more villages already exists!');
    }
    const newVillages = yield category_model_1.Village.create(villages);
    if (!newVillages.length) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create villages');
    }
    return newVillages;
});
const updateVillage = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const village = yield category_model_1.Village.findById(id);
    if (!village) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Village not found!');
    }
    // if the title is same as before, should ignore updating in db
    // THIS IS IMPORTANT to avoid conflict error.
    if (village.title === payload.title) {
        return village;
    }
    // check if same titled village exists with same unionId
    const isVillageExists = yield category_model_1.Village.findOne({
        unionId: village.unionId,
        title: payload.title,
    });
    if (isVillageExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Village already exists!');
    }
    const updatedVillage = yield category_model_1.Village.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!updatedVillage) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update village!');
    }
    return updatedVillage;
});
const deleteVillage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedVillage = yield category_model_1.Village.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    if (!deletedVillage) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Village not found!');
    }
    return deletedVillage;
});
const getVillages = (unionId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const villageQuery = new QueryBuilder_1.default(category_model_1.Village.find({ unionId }), query)
        .filter()
        .fields();
    const villages = yield villageQuery.modelQuery;
    if (!villages.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No village found!');
    }
    return villages;
});
exports.VillageServices = {
    createVillages,
    updateVillage,
    deleteVillage,
    getVillages,
};
