const { getVillagesByUnionValueService } = require('../services/village.service');
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
