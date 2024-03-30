const {
    getVillagesByUnionValueService,
    getAllVillagesService,
    createVillagesService,
    updateVillageByValueService,
    deleteVillageByValueService,
} = require('../services/village.service');
const sendResponse = require('../utils/sendResponse');

exports.getVillagesByUnionValue = async (req, res) => {
    try {
        const { unionValue } = req.params;
        const villages = await getVillagesByUnionValueService(unionValue);

        if (!villages) {
            return sendResponse(res, {
                status: 400,
                message: 'No village found with this union value!',
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
        // find existing villages to calculate max value
        const existingVillages = await getAllVillagesService();
        const values = existingVillages.map((village) => village.value);
        const maxValue = Math.max(...values);

        // add value dynamically based on the previous max value
        let villages = req.body;
        villages = villages.map((village, index) => ({ ...village, value: maxValue + index + 1 }));

        const result = await createVillagesService(villages);

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

exports.updateVillageByValue = async (req, res) => {
    try {
        const { value } = req.params;

        const response = await updateVillageByValueService(value, req.body);

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

exports.deleteVillageByValue = async (req, res) => {
    try {
        const { value } = req.params;

        const response = await deleteVillageByValueService(value);

        if (!response.deletedCount) {
            return sendResponse(res, {
                status: 500,
                message: 'Internal Server Error!',
            });
        }

        sendResponse(res, {
            status: 200,
            message: 'Successfully deleted!',
            data: response,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};
