import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UpazilaServices } from './upazila.service';

const getUpazilas = catchAsync(async (req, res) => {
    const result = await UpazilaServices.getUpazilas(req.params.districtId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully fetched upazilas!',
        data: result,
    });
});

export const UpazilaControllers = {
    getUpazilas,
};
