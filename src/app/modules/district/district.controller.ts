import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DistrictServices } from './district.service';

const getDistricts = catchAsync(async (req, res) => {
    const result = await DistrictServices.getDistricts(req.params.divisionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully fetched districts!',
        data: result,
    });
});

export const DistrictControllers = {
    getDistricts,
};
