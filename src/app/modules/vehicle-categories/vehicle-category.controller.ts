import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VehicleCategoryServices } from './vehicle-category.service';

const createVehicleCategory = catchAsync(async (req, res) => {
    const result = await VehicleCategoryServices.createVehicleCategory(
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Successfully created vehicle category!',
        data: result,
    });
});

// const updateVehicleCategory = catchAsync(async (req, res) => {
//     const result = await VehicleCategoryServices.updateVehicleCategory(
//         req.params.id,
//         req.body,
//     );

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Successfully updated the village!',
//         data: result,
//     });
// });

// const deleteVehicleCategory = catchAsync(async (req, res) => {
//     const result = await VehicleCategoryServices.deleteVehicleCategory(
//         req.params.id,
//     );

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Successfully deleted the village!',
//         data: result,
//     });
// });

// const getVehicleCategories = catchAsync(async (req, res) => {
//     const result = await VehicleCategoryServices.getVehicleCategories(
//         req.params.unionId,
//         req.query,
//     );

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         message: 'Successfully fetched villages!',
//         data: result,
//     });
// });

export const VehicleCategoryControllers = {
    createVehicleCategory,
    // updateVehicleCategory,
    // deleteVehicleCategory,
    // getVehicleCategories,
};
