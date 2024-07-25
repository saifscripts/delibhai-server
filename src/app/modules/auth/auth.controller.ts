import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from '../user/user.service';
import { AuthServices } from './auth.service';

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
    const result = await UserServices.getUserFromDB(req.user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully fetched user data!',
        data: result,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully retrieved refresh token!',
        data: result,
    });
});

const changePassword = catchAsync(async (req, res) => {
    const result = await AuthServices.changePassword(req.user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Password changed successfully!',
        data: result,
    });
});

export const AuthControllers = {
    login,
    getMe,
    refreshToken,
    changePassword,
};
