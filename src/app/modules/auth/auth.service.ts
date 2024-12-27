import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import generateExpiryDate from '../../utils/generateExpiryDate';
import generateRandomNumber from '../../utils/generateRandomNumber';
import { generateRiderId } from '../rider/rider.utils';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { generateInProgressUserId } from '../user/user.util';
import { IChangePassword, ICredentials, IVerifyOTP } from './auth.interface';
import { createToken } from './auth.util';

const createRider = async (payload: IUser) => {
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
        tempMobile: payload.mobile, // save actual mobile number as tempMobile
    };

    const newUser = await User.create(userData);

    if (!newUser) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to create rider!',
        );
    }

    // TODO: stop sending whole User Data
    // Only _id should be sent and OTP must be stopped sending
    return newUser;
};

const verifyOTP = async (payload: IVerifyOTP) => {
    const user = await User.findById(payload._id, {}, { getAll: true });

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
                tempMobile: 1,
            },
            $set: {
                id: await generateRiderId(),
                mobile: user.tempMobile,
                contactNo1: user.tempMobile,
                contactNo2: user.tempMobile,
                status: 'active',
            },
        },
        { new: true, runValidators: true },
    );

    return { user: updatedUser, accessToken, refreshToken };
};

const resendOTP = async (payload: { _id: string }) => {
    const user = await User.findById(payload._id, {}, { getAll: true });

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Session expired!');
    }

    // tempMobile is always removed after otp verification
    if (!user?.tempMobile) {
        throw new AppError(httpStatus.BAD_REQUEST, 'OTP already verified!');
    }

    // Previous OTP must be expired to resend a new OTP
    if (user.otpExpires.getTime() > Date.now()) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Previous OTP isn't expired yet!",
        );
    }

    // generate new otp and update user data
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            otp: generateRandomNumber(6), // 6 digits random otp
            otpExpires: generateExpiryDate(1), // 1 minute from the current time
            otpSessionExpires: generateExpiryDate(10), // 10 minutes from the current time
        },
        { new: true },
    );

    // Send otp to the user's phone number
    // await sendSMS(`Verification Code: ${otp}`, user.tempMobile);

    return updatedUser;
};

const login = async (payload: ICredentials) => {
    const user = await User.findOne({ mobile: payload?.mobile }).select(
        '+password',
    );

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const userStatus = user?.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
    }

    const isPasswordMatched = await User.comparePassword(
        payload?.password,
        user?.password,
    );

    if (!isPasswordMatched) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Wrong mobile number or password!',
        );
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

    user.password = '';

    return {
        accessToken,
        refreshToken,
        user,
    };
};

const getMe = async (id: string) => {
    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return user;
};

const refreshToken = async (token: string) => {
    const decoded = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;

    const { id, iat } = decoded;

    const user = await User.findById(id);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const userStatus = user?.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    if (
        user.passwordChangedAt &&
        User.isJWTIssuedBeforePasswordChange(
            iat as number,
            user.passwordChangedAt,
        )
    ) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized!!!',
        );
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

    return {
        accessToken,
        refreshToken,
    };
};

const changePassword = async (
    decodedUser: JwtPayload,
    payload: IChangePassword,
) => {
    const user = await User.findById(decodedUser?.id).select('+password');

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const userStatus = user?.status;

    if (userStatus === 'blocked') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    const isPasswordMatched = await User.comparePassword(
        payload?.oldPassword,
        user?.password,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong password!');
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findByIdAndUpdate(
        user._id,
        {
            password: hashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
        {
            new: true,
        },
    );

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

    return { accessToken, refreshToken };
};

export const AuthServices = {
    createRider,
    verifyOTP,
    resendOTP,
    login,
    getMe,
    refreshToken,
    changePassword,
};
