import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Rider } from '../rider/rider.model';
import { User } from '../user/user.model';
import { IChangePassword, ICredentials } from './auth.interface';
import { createToken } from './auth.util';

const login = async (payload: ICredentials) => {
    const user = await User.findOne({ mobile: payload?.mobile }).select(
        '+password',
    );

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
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

const getMeFromDB = async (id: string) => {
    const user = await User.findById(id).lean();

    let profile;

    if (user!.role === 'rider') {
        profile = await Rider.findOne({ user: user!._id }).lean();
        // .populate({
        //     path: 'presentAddress permanentAddress ownerAddress serviceAddress manualLocation mainStation',
        //     populate: {
        //         path: 'division district upazila union village',
        //         select: 'title unionId wardId',
        //     },
        // });
    }

    if (!profile) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return { ...user, ...profile };
};

const refreshToken = async (token: string) => {
    const decoded = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;

    const { id, iat } = decoded;

    const user = await User.findOne({ id });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
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
        id: user.id,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_exp_in as string,
    );

    return {
        accessToken,
    };
};

const changePassword = async (
    decodedUser: JwtPayload,
    payload: IChangePassword,
) => {
    const user = await User.findOne({ id: decodedUser?.id }).select(
        '+password',
    );

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
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
        throw new AppError(httpStatus.BAD_REQUEST, "Password didn't match!");
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        { id: decodedUser.id, role: decodedUser.role },
        {
            password: hashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
        {
            new: true,
        },
    );

    return null;
};

export const AuthServices = {
    login,
    getMeFromDB,
    refreshToken,
    changePassword,
};
