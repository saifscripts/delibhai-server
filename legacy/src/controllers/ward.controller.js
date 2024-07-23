const { getWardsByUnionCodeService } = require('../services/ward.service');
const sendResponse = require('../utils/sendResponse');

exports.getWardsByUnionCode = async (req, res) => {
    try {
        const { unionCode } = req.params;
        const wards = await getWardsByUnionCodeService(unionCode);

        if (!wards) {
            return sendResponse(res, {
                status: 400,
                message: 'No ward found with this id!',
            });
        }

        sendResponse(res, {
            status: 200,
            data: wards,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};
