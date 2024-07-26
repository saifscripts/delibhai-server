import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VillageServices } from './village.service';

const getVillages = catchAsync(async (req, res) => {
    const result = await VillageServices.getVillagesFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully fetched villages!',
        data: result,
    });
});

export const VillageControllers = {
    getVillages,
};
