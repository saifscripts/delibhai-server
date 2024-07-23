const { getDistrictsService } = require('../services/district.service');
const sendResponse = require('../utils/sendResponse');

exports.getDistricts = async (req, res) => {
    try {
        const { divisionId } = req.params;
        const districts = await getDistrictsService(divisionId);

        if (!districts) {
            return sendResponse(res, {
                status: 400,
                message: 'No district found!',
            });
        }

        sendResponse(res, {
            status: 200,
            data: districts,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};
