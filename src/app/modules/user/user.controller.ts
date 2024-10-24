import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const getUser = catchAsync(async (req, res) => {
    const result = await UserServices.getUser(req.params.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully fetched user!',
        data: result,
    });
});

const updateSingleUser = catchAsync(async (req, res) => {
    const result = await UserServices.updateUserIntoDB(req.user.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Successfully updated user data!',
        data: result,
    });
});

export const UserControllers = {
    getUser,
    updateSingleUser,
};
