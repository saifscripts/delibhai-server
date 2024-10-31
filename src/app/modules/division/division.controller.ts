import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DivisionServices } from './division.service';

const getAllDivisions = catchAsync(async (_req, res) => {
    const result = await DivisionServices.getAllDivisions();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully fetched divisions!',
        data: result,
    });
});

export const DivisionControllers = {
    getAllDivisions,
};
