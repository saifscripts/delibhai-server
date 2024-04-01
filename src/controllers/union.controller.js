const { getUnionsService } = require('../services/union.service');
const sendResponse = require('../utils/sendResponse');

exports.getUnions = async (req, res) => {
    try {
        const { upazilaId } = req.params;
        const unions = await getUnionsService(upazilaId);

        if (!unions) {
            return sendResponse(res, {
                status: 400,
                message: 'No union found!',
            });
        }

        sendResponse(res, {
            status: 200,
            data: unions,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};
