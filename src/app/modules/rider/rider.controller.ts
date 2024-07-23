import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RiderServices } from './rider.service';

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
    updateRider,
};
