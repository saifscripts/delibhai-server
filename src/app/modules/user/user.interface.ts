import { Model } from 'mongoose';
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

export interface IVerifyOTP {
    _id: string;
    otp: string;
}

export interface UserModel extends Model<IUser> {
    comparePassword(plain: string, hashed: string): Promise<boolean>;
    isJWTIssuedBeforePasswordChange(
        jwtIssuedAt: number,
        passwordChangedAt: Date,
    ): boolean;
}
