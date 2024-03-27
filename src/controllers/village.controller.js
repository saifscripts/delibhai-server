const { getVillagesByWardCodeService } = require('../services/village.service');
const sendResponse = require('../utils/sendResponse');

exports.getVillagesByWardCode = async (req, res) => {
    try {
        const { wardCode } = req.params;
        const villages = await getVillagesByWardCodeService(wardCode);

        if (!villages) {
            return sendResponse(res, {
                status: 400,
                message: 'No village found with this id!',
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
