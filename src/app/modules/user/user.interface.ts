import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type IUserRole = keyof typeof USER_ROLE;

interface ICropData {
    unit: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface IUser {
    id: string;
    name: string;
    fatherName: string;
    gender: 'পুরুষ' | 'মহিলা' | 'অন্যান্য';
    bloodGroup: 'এ+' | 'বি+' | 'এবি+' | 'ও+' | 'এ-' | 'বি-' | 'এবি-' | 'ও-';
    dateOfBirth: string;
    nid: string;
    nidURL: string;
    avatarURL: string;
    avatarOriginURL: string;
    avatarCropData: ICropData;
    contactNo1: string;
    contactNo2: string;
    email: string;
    facebookURL: string;
    presentAddress: IAddress;
    permanentAddress: IAddress;
    vehicleType: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber: string;
    vehicleName: string;
    ownerName: string;
    ownerAddress: IAddress;
    ownerContactNo: string;
    ownerEmail: string;
    vehiclePhotos: string[];
    serviceType: 'ব্যক্তিগত' | 'ভাড়ায় চালিত';
    rentType:
        | 'লোকাল ভাড়া'
        | 'রিজার্ভ ভাড়া'
        | 'লোকাল ও রিজার্ভ ভাড়া'
        | 'কন্টাক্ট ভাড়া';
    mainStation: IAddress;
    serviceArea: IArea[];
    serviceTimeSlots: ITimeSlot[];
    serviceStatus: 'off' | 'scheduled' | 'on';
    liveLocation: IGeoLocation;
    manualLocation: IGeoLocation;
    videoURL: string;
    mobile: string;
    password: string;
    status: 'in-progress' | 'active' | 'blocked';
    role: IUserRole;
    otp: string;
    otpExpires: Date;
    otpSessionExpires: Date;
    tempMobile: string;
    passwordChangedAt: Date;
    isDeleted: boolean;
}

export interface IAddress {
    division: {
        title: string;
        _id: Types.ObjectId;
    };
    district: {
        title: string;
        _id: Types.ObjectId;
    };
    upazila: {
        title: string;
        _id: Types.ObjectId;
    };
    union: {
        title: string;
        _id: Types.ObjectId;
    };
    village: {
        title: string;
        _id: Types.ObjectId;
    };
}

export interface IArea {
    division: {
        title: string;
        _id: Types.ObjectId;
    };
    district: {
        title: string;
        _id: Types.ObjectId;
    };
    upazila: {
        title: string;
        _id: Types.ObjectId;
    };
    union: {
        title: string;
        _id: Types.ObjectId;
    };
    village: {
        title: string;
        _id: Types.ObjectId;
    }[];
}

export interface ITimeSlot {
    start: string;
    end: string;
}

export interface IGeoLocation {
    latitude: number;
    longitude: number;
    timestamp?: number;
}

export interface IRider {
    id: string;
    user: Types.ObjectId;
    contactNo1: string;
    contactNo2: string;
    email: string;
    facebookURL: string;
    presentAddress: IAddress;
    permanentAddress: IAddress;
    vehicleType: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber: string;
    vehicleName: string;
    ownerName: string;
    ownerAddress: IAddress;
    ownerContactNo: string;
    ownerEmail: string;
    vehiclePhotos: string[];
    serviceType: 'ব্যক্তিগত' | 'ভাড়ায় চালিত';
    rentType:
        | 'লোকাল ভাড়া'
        | 'রিজার্ভ ভাড়া'
        | 'লোকাল ও রিজার্ভ ভাড়া'
        | 'কন্টাক্ট ভাড়া';
    mainStation: IAddress;
    serviceArea: IArea[];
    serviceTimeSlots: ITimeSlot[];
    serviceStatus: 'off' | 'scheduled' | 'on';
    liveLocation: IGeoLocation;
    manualLocation: IGeoLocation;
    videoURL: string;
    isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
    comparePassword(plain: string, hashed: string): Promise<boolean>;
    isJWTIssuedBeforePasswordChange(
        jwtIssuedAt: number,
        passwordChangedAt: Date,
    ): boolean;
}
