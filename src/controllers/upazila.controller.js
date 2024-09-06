const { getUpazilasService } = require('../services/upazila.service');
const sendResponse = require('../utils/sendResponse');

exports.getUpazilas = async (req, res) => {
    try {
        const { districtId } = req.params;
        const upazilas = await getUpazilasService(districtId);

        if (!upazilas) {
            return sendResponse(res, {
                status: 400,
                message: 'No upazila found!',
            });
        }

        sendResponse(res, {
            status: 200,
            data: upazilas,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};
