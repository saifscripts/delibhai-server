const { getAllDivisionService } = require('../services/division.service');
const sendResponse = require('../utils/sendResponse');

exports.getAllDivision = async (req, res) => {
    try {
        const division = await getAllDivisionService();

        if (!division) {
            return sendResponse(res, {
                status: 400,
                message: 'No division found!',
            });
        }

        sendResponse(res, {
            status: 200,
            data: division,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};
