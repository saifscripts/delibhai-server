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
    const result = await RiderServices.updateRider(req.user.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rider updated successfully!',
        data: result,
    });
});

const addServiceArea = catchAsync(async (req, res) => {
    const result = await RiderServices.addServiceArea(req.user.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Service area added successfully!',
        data: result,
    });
});

const deleteServiceArea = catchAsync(async (req, res) => {
    const result = await RiderServices.deleteServiceArea(
        req.user.id,
        req.params.id,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Service area deleted successfully!',
        data: result,
    });
});

const updateLocation = catchAsync(async (req, res) => {
    const result = await RiderServices.updateLocation(req.user.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rider location updated successfully!',
        data: result,
    });
});

const getLocation = catchAsync(async (req, res) => {
    const result = await RiderServices.getLocation(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rider location retrieved successfully!',
        data: result,
    });
});

export const RiderControllers = {
    getRiders,
    updateRider,
    addServiceArea,
    deleteServiceArea,
    updateLocation,
    getLocation,
};
