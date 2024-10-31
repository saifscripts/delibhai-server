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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const addressSchema = new mongoose_1.Schema({
    division: {
        title: String,
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Division' },
    },
    district: {
        title: String,
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'District' },
    },
    upazila: {
        title: String,
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Upazila' },
    },
    union: {
        title: String,
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Union' },
    },
    village: {
        title: String,
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Village' },
    },
}, { _id: false });
const areaSchema = new mongoose_1.Schema({
    division: {
        title: String,
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Division' },
    },
    district: {
        title: String,
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'District' },
    },
    upazila: {
        title: String,
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Upazila' },
    },
    union: {
        title: String,
        _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Union' },
    },
    village: [
        {
            title: String,
            _id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Village' },
        },
    ],
}, { _id: false });
const userSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fatherName: String,
    gender: { type: String, enum: ['পুরুষ', 'মহিলা', 'অন্যান্য'] },
    bloodGroup: {
        type: String,
        enum: ['এ+', 'বি+', 'এবি+', 'ও+', 'এ-', 'বি-', 'এবি-', 'ও-'],
    },
    dateOfBirth: String,
    nid: String,
    nidURL: String,
    avatarURL: String,
    avatarOriginURL: String,
    avatarCropData: {
        unit: String,
        x: Number,
        y: Number,
        width: Number,
        height: Number,
    },
    contactNo1: String,
    contactNo2: String,
    email: String,
    facebookURL: String,
    presentAddress: addressSchema,
    permanentAddress: addressSchema,
    vehicleType: String,
    vehicleBrand: String,
    vehicleModel: String,
    vehicleNumber: String,
    vehicleName: String,
    ownerName: String,
    ownerAddress: addressSchema,
    ownerContactNo: String,
    ownerEmail: String,
    vehiclePhotos: [String],
    serviceType: {
        type: String,
        enum: ['ব্যক্তিগত', 'ভাড়ায় চালিত'],
    },
    rentType: {
        type: String,
        enum: [
            'লোকাল ভাড়া',
            'রিজার্ভ ভাড়া',
            'লোকাল ও রিজার্ভ ভাড়া',
            'কন্টাক্ট ভাড়া',
        ],
    },
    mainStation: addressSchema,
    serviceArea: [areaSchema],
    serviceTimeSlots: [
        {
            start: String,
            end: String,
        },
    ],
    serviceStatus: {
        type: String,
        enum: ['off', 'scheduled', 'on'],
        default: 'scheduled',
    },
    liveLocation: {
        latitude: Number,
        longitude: Number,
        timestamp: Number,
    },
    manualLocation: {
        latitude: Number,
        longitude: Number,
    },
    videoURL: String,
    mobile: { type: String, unique: true },
    password: { type: String, required: true, select: 0 },
    status: {
        type: String,
        enum: ['in-progress', 'active', 'blocked'],
        default: 'in-progress',
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'rider'],
    },
    otp: String,
    otpExpires: Date,
    otpSessionExpires: Date,
    tempMobile: String,
    passwordChangedAt: Date,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Query Middleware
userSchema.pre('find', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true }, status: 'active' });
    next();
});
userSchema.pre('findOne', function (next) {
    if (this.getOptions().getAll) {
        return next();
    }
    this.find({ isDeleted: { $ne: true }, status: 'active' });
    next();
});
userSchema.pre('aggregate', function (next) {
    if (this.options.getAll) {
        return next();
    }
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true }, status: 'active' },
    });
    next();
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
userSchema.post('save', function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        doc.password = '';
        next();
    });
});
userSchema.statics.comparePassword = function (plain, hashed) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plain, hashed);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChange = function (jwtIssuedTimeStamp, passwordChangedAt) {
    const passwordChangeTimeStamp = Math.floor(new Date(passwordChangedAt).getTime() / 1000);
    return passwordChangeTimeStamp > jwtIssuedTimeStamp;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
