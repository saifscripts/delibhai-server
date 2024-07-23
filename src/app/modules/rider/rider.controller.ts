import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RiderServices } from './rider.service';

import config from '../../config';

const createRider = catchAsync(async (req, res) => {
    const result = await RiderServices.createRiderIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Rider created successfully!',
        data: result,
    });
});

const verifyOTP = catchAsync(async (req, res) => {
    const { refreshToken, ...restData } = await RiderServices.verifyOTPFromDB(
        req.body,
    );

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

const updateRider = catchAsync(async (req, res) => {
    const result = await RiderServices.updateRiderIntoDB(
        req.params.id,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rider created successfully!',
        data: result,
    });
});

export const RiderControllers = {
    createRider,
    verifyOTP,
    updateRider,
};
