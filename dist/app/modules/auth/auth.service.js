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
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const generateExpiryDate_1 = __importDefault(require("../../utils/generateExpiryDate"));
const generateRandomNumber_1 = __importDefault(require("../../utils/generateRandomNumber"));
const rider_utils_1 = require("../rider/rider.utils");
const user_model_1 = require("../user/user.model");
const user_util_1 = require("../user/user.util");
const auth_util_1 = require("./auth.util");
const createRider = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ mobile: payload.mobile });
    if (isUserExist) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'A user already exists with this mobile number!');
    }
    const userData = Object.assign(Object.assign({}, payload), { id: yield (0, user_util_1.generateInProgressUserId)(), role: 'rider', otp: (0, generateRandomNumber_1.default)(6), otpExpires: (0, generateExpiryDate_1.default)(1), otpSessionExpires: (0, generateExpiryDate_1.default)(10), mobile: (0, generateRandomNumber_1.default)(11), tempMobile: payload.mobile });
    const newUser = yield user_model_1.User.create(userData);
    if (!newUser) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create rider!');
    }
    // TODO: stop sending whole User Data
    // Only _id should be sent and OTP must be stopped sending
    return newUser;
});
const verifyOTP = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(payload._id, {}, { getAll: true });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (!(user === null || user === void 0 ? void 0 : user.otp)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'OTP already verified!');
    }
    if (user.otp !== payload.otp) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong OTP!');
    }
    if (user.otpExpires.getTime() < Date.now()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'OTP Expired!');
    }
    const jwtPayload = {
        id: user._id,
        role: user.role,
    };
    const accessToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_exp_in);
    const refreshToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_exp_in);
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(payload._id, {
        $unset: {
            otp: 1,
            otpExpires: 1,
            otpSessionExpires: 1,
            tempMobile: 1,
        },
        $set: {
            id: yield (0, rider_utils_1.generateRiderId)(),
            mobile: user.tempMobile,
            contactNo1: user.tempMobile,
            status: 'active',
        },
    }, { new: true, runValidators: true });
    return { user: updatedUser, accessToken, refreshToken };
});
const resendOTP = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(payload._id, {}, { getAll: true });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Session expired!');
    }
    // tempMobile is always removed after otp verification
    if (!(user === null || user === void 0 ? void 0 : user.tempMobile)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'OTP already verified!');
    }
    // Previous OTP must be expired to resend a new OTP
    if (user.otpExpires.getTime() > Date.now()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Previous OTP isn't expired yet!");
    }
    // generate new otp and update user data
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(user._id, {
        otp: (0, generateRandomNumber_1.default)(6), // 6 digits random otp
        otpExpires: (0, generateExpiryDate_1.default)(1), // 1 minute from the current time
        otpSessionExpires: (0, generateExpiryDate_1.default)(10), // 10 minutes from the current time
    }, { new: true });
    // Send otp to the user's phone number
    // await sendSMS(`Verification Code: ${otp}`, user.tempMobile);
    return updatedUser;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ mobile: payload === null || payload === void 0 ? void 0 : payload.mobile }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is blocked!');
    }
    const isPasswordMatched = yield user_model_1.User.comparePassword(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong mobile number or password!');
    }
    const jwtPayload = {
        id: user._id,
        role: user.role,
    };
    const accessToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_exp_in);
    const refreshToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_exp_in);
    user.password = '';
    return {
        accessToken,
        refreshToken,
        user,
    };
});
const getMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return user;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const { id, iat } = decoded;
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is blocked');
    }
    if (user.passwordChangedAt &&
        user_model_1.User.isJWTIssuedBeforePasswordChange(iat, user.passwordChangedAt)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!!!');
    }
    const jwtPayload = {
        id: user._id,
        role: user.role,
    };
    const accessToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_exp_in);
    const refreshToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_exp_in);
    return {
        accessToken,
        refreshToken,
    };
});
const changePassword = (decodedUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedUser === null || decodedUser === void 0 ? void 0 : decodedUser.id).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is blocked');
    }
    const isPasswordMatched = yield user_model_1.User.comparePassword(payload === null || payload === void 0 ? void 0 : payload.oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong password!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    }, {
        new: true,
    });
    const jwtPayload = {
        id: user._id,
        role: user.role,
    };
    const accessToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_exp_in);
    const refreshToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_exp_in);
    return { accessToken, refreshToken };
});
exports.AuthServices = {
    createRider,
    verifyOTP,
    resendOTP,
    login,
    getMe,
    refreshToken,
    changePassword,
};
