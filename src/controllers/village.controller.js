const {
    getVillagesByUnionIdService,
    createVillagesService,
    updateVillageByIdService,
    deleteVillageByIdService,
} = require('../services/village.service');
const sendResponse = require('../utils/sendResponse');
const Village = require('../models/Village');

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
        const villages = req.body;

        const promises = [];
        villages.forEach((village) => {
            promises.push(
                Village.findOne({
                    unionId: village?.unionId,
                    title: village?.title,
                }),
            );
        });

        const existingVillages = (await Promise.all(promises)).filter(
            (item) => item !== null && item !== undefined,
        );

        if (existingVillages?.length > 0) {
            return sendResponse(res, {
                status: 403,
                code: 'ALREADY_EXIST',
                data: { titles: existingVillages?.map(({ title }) => title) },
                message: 'Village already exist!',
            });
        }

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

        const village = await Village.findOne({
            title: req.body.title.trim(),
            unionId: req.body.unionId,
        });

        if (village) {
            return sendResponse(res, {
                status: 403,
                code: 'ALREADY_EXIST',
                data: { title: village?.title },
                message: 'Village already exist!',
            });
        }

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
