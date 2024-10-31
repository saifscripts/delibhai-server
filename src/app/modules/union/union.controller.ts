import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UnionServices } from './union.service';

const getUnions = catchAsync(async (req, res) => {
    const result = await UnionServices.getUnions(req.params.upazilaId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully fetched unions!',
        data: result,
    });
});

export const UnionControllers = {
    getUnions,
};
