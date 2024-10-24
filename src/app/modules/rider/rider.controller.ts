import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RiderServices } from './rider.service';

const getRiders = catchAsync(async (req, res) => {
    const result = await RiderServices.getRiders(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Riders fetched successfully!',
        data: result,
    });
});

const updateRider = catchAsync(async (req, res) => {
    const result = await RiderServices.updateRiderIntoDB(req.user.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rider updated successfully!',
        data: result,
    });
});

export const RiderControllers = {
    getRiders,
    updateRider,
};
