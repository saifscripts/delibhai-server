import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createRider = catchAsync(async (req, res) => {
    const result = await UserServices.createRiderIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Rider created successfully!',
        data: result,
    });
});

const verifyRiderOTP = catchAsync(async (req, res) => {
    const { refreshToken, ...restData } =
        await UserServices.verifyRiderOTPFromDB(req.body);

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'OTP verified successfully!',
        data: restData,
    });
});

export const UserControllers = {
    createRider,
    verifyRiderOTP,
};
