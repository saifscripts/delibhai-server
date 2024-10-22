import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const createRider = catchAsync(async (req, res) => {
    const result = await AuthServices.createRider(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Rider created successfully!',
        data: result,
    });
});

const verifyOTP = catchAsync(async (req, res) => {
    const { refreshToken, ...restData } = await AuthServices.verifyOTP(
        req.body,
    );

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Registration successful!',
        data: restData,
    });
});

const login = catchAsync(async (req, res) => {
    const { refreshToken, ...restData } = await AuthServices.login(req.body);

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully logged in!',
        data: restData,
    });
});

const getMe = catchAsync(async (req, res) => {
    const result = await AuthServices.getMe(req.user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully fetched user data!',
        data: result,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken: oldRefreshToken } = req.cookies;

    const { refreshToken: newRefreshToken, ...restData } =
        await AuthServices.refreshToken(oldRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Token refreshed successfully!',
        data: restData,
    });
});

const changePassword = catchAsync(async (req, res) => {
    const { refreshToken, ...restData } = await AuthServices.changePassword(
        req.user,
        req.body,
    );

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Password changed successfully!',
        data: restData,
    });
});

export const AuthControllers = {
    createRider,
    verifyOTP,
    login,
    getMe,
    refreshToken,
    changePassword,
};
