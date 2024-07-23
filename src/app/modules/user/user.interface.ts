import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type IUserRole = keyof typeof USER_ROLE;

export interface IUser {
    id: string;
    name: string;
    gender: 'পুরুষ' | 'মহিলা' | 'অন্যান্য';
    phone: string;
    password: string;
    passwordChangedAt?: Date;
    status: 'in-progress' | 'active' | 'blocked';
    role: IUserRole;
    tempPhone?: string;
    otp: string;
    otpExpires: Date;
    otpSessionExpires: Date;
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
