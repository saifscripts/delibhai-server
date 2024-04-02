const {
    getVillagesByUnionIdService,
    createVillagesService,
    updateVillageByIdService,
    deleteVillageByIdService,
} = require('../services/village.service');
const sendResponse = require('../utils/sendResponse');

exports.getVillagesByUnionId = async (req, res) => {
    try {
        const { unionId } = req.params;
        const villages = await getVillagesByUnionIdService(unionId);

        if (!villages) {
            return sendResponse(res, {
                status: 400,
                message: 'No village found with this union id!',
            });
        }

        sendResponse(res, {
            status: 200,
            data: villages,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};

exports.createVillages = async (req, res) => {
    try {
        const result = await createVillagesService(req.body);

        sendResponse(res, {
            status: 200,
            data: result,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};

exports.updateVillageById = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await updateVillageByIdService(id, req.body);

        if (!response.modifiedCount) {
            return sendResponse(res, {
                status: 500,
                message: 'Internal Server Error!',
            });
        }

        sendResponse(res, {
            status: 200,
            message: 'Successfully updated!',
            data: response,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};

exports.deleteVillageById = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await deleteVillageByIdService(id);

        if (!response.deletedCount) {
            return sendResponse(res, {
                status: 500,
                message: 'Internal Server Error!',
            });
        }

        sendResponse(res, {
            status: 200,
            data: response,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};

// exports.getVillageTitleById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const village = await getVillageByIdService(id);

//         if (!village) {
//             return sendResponse(res, {
//                 status: 404,
//                 message: 'Village Not Found!',
//             });
//         }

//         sendResponse(res, {
//             status: 200,
//             message: 'Successfully deleted!',
//             data: village.title,
//         });
//     } catch (error) {
//         const status = error.status || 500;
//         const message = error.message || 'Internal Server Error!';
//         sendResponse(res, { status, message, error });
//     }
// };
