import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VillageServices } from './vehicle-category.service';

const createVillages = catchAsync(async (req, res) => {
    const result = await VillageServices.createVillages(req.body.villages);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Successfully created villages!',
        data: result,
    });
});

const updateVillage = catchAsync(async (req, res) => {
    const result = await VillageServices.updateVillage(req.params.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully updated the village!',
        data: result,
    });
});

const deleteVillage = catchAsync(async (req, res) => {
    const result = await VillageServices.deleteVillage(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully deleted the village!',
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
    updateVillage,
    deleteVillage,
    getVillages,
};
