import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VillageServices } from './village.service';

const createVillages = catchAsync(async (req, res) => {
    const result = await VillageServices.createVillages(req.body.villages);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Successfully created villages!',
        data: result,
    });
});

const getVillages = catchAsync(async (req, res) => {
    const result = await VillageServices.getVillages(
        req.params.unionId,
        req.query,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully fetched villages!',
        data: result,
    });
});

export const VillageControllers = {
    createVillages,
    getVillages,
};
