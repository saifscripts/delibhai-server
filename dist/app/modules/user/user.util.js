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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInProgressUserId = void 0;
const user_model_1 = require("./user.model");
const findLastInProgressUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastInProgressUser = yield user_model_1.User.findOne({ status: 'in-progress' }, { id: 1 }, { getDeletedDocs: true }).sort({
        id: -1,
    });
    return (lastInProgressUser === null || lastInProgressUser === void 0 ? void 0 : lastInProgressUser.id)
        ? lastInProgressUser.id.substring(2)
        : undefined;
});
const generateInProgressUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastInProgressUserId = yield findLastInProgressUserId();
    const currentId = Number(lastInProgressUserId) || 0;
    const incrementedId = (currentId + 1).toString().padStart(6, '0');
    return `DX${incrementedId}`;
});
exports.generateInProgressUserId = generateInProgressUserId;
