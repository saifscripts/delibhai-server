import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import generateExpiryDate from '../../utils/generateExpiryDate';
import generateRandomNumber from '../../utils/generateRandomNumber';
import { createToken } from '../auth/auth.util';
import { IUser, IVerifyOTP } from '../user/user.interface';
import { User } from '../user/user.model';
import { UserServices } from '../user/user.service';
import { generateInProgressUserId } from '../user/user.util';
import { IRider } from './rider.interface';
import { Rider } from './rider.model';
import { generateRiderId } from './rider.utils';

const createRiderIntoDB = async (payload: IUser) => {
    const isUserExist = await User.findOne({ mobile: payload.mobile });

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
        mobile: generateRandomNumber(11), // 11 digit random number for in-progress user
        tempMobile: payload.mobile.slice(-11), // save actual mobile number as tempMobile
    };

    const newUser = await User.create(userData);

    if (!newUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create rider!');
    }

    return newUser;
};

const verifyOTPFromDB = async (payload: IVerifyOTP) => {
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

    // start transaction
    const updatedUser = await User.findByIdAndUpdate(
        payload._id,
        {
            $unset: {
                otp: 1,
                otpExpires: 1,
                otpSessionExpires: 1,
                tempMobile: 1,
            },
            $set: {
                id: await generateRiderId(),
                mobile: user.tempMobile,
                status: 'active',
            },
        },
        { new: true, runValidators: true },
    );

    const newRider = await Rider.create({
        id: updatedUser?.id,
        user: updatedUser?._id,
        contactNo1: updatedUser?.mobile,
    });
    // end transaction

    return { user: updatedUser, rider: newRider, accessToken, refreshToken };
};

const updateRiderIntoDB = async (id: string, payload: IRider) => {
    const updatedRider = await Rider.findOneAndUpdate({ user: id }, payload, {
        new: true,
    });

    if (!updatedRider) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update rider!');
    }

    return await UserServices.getUserFromDB(id);
};

export const RiderServices = {
    createRiderIntoDB,
    verifyOTPFromDB,
    updateRiderIntoDB,
};
