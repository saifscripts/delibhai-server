import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken } from '../auth/auth.util';
import { Rider } from '../rider/rider.model';
import { IUser, IVerifyOTP } from './user.interface';
import { User } from './user.model';
import {
    generateExpiryDate,
    generateInProgressUserId,
    generateRandomNumber,
    generateRiderId,
} from './user.util';

const createRiderIntoDB = async (payload: IUser) => {
    const isUserExist = await User.findOne({ phone: payload.phone });

    if (isUserExist) {
        throw new AppError(
            httpStatus.CONFLICT,
            'A user already exists with this mobile number!',
        );
    }

    const userData: Partial<IUser> = {
        ...payload,
        id: await generateInProgressUserId(),
        role: 'rider',
        otp: generateRandomNumber(6), // 6 digits random otp
        otpExpires: generateExpiryDate(1), // 1 minute from the current time
        otpSessionExpires: generateExpiryDate(10), // 10 minutes from the current time
        phone: generateRandomNumber(11), // 11 digit random number for in-progress user
        tempPhone: payload.phone.slice(-11), // save actual phone number as tempPhone
    };

    const newUser = await User.create(userData);

    if (!newUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create rider!');
    }

    return newUser;
};

const verifyRiderOTPFromDB = async (payload: IVerifyOTP) => {
    const user = await User.findById(payload._id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (!user?.otp) {
        throw new AppError(httpStatus.BAD_REQUEST, 'OTP already verified!');
    }

    if (user.otp !== payload.otp) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong OTP!');
    }

    if (user.otpExpires.getTime() < Date.now()) {
        throw new AppError(httpStatus.BAD_REQUEST, 'OTP Expired!');
    }

    const jwtPayload = {
        id: user._id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_exp_in as string,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_exp_in as string,
    );

    const updatedUser = await User.findByIdAndUpdate(
        payload._id,
        {
            $unset: {
                otp: 1,
                otpExpires: 1,
                otpSessionExpires: 1,
                tempPhone: 1,
            },
            $set: {
                id: await generateRiderId(),
                phone: user.tempPhone,
                status: 'active',
            },
        },
        { new: true, runValidators: true },
    );

    const newRider = await Rider.create({
        id: updatedUser?.id,
        user: updatedUser?._id,
        contactNo: updatedUser?.phone,
    });

    return { user: updatedUser, rider: newRider, accessToken, refreshToken };
};

export const UserServices = {
    createRiderIntoDB,
    verifyRiderOTPFromDB,
};
