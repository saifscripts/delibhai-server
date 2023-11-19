const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendResponse = require('../utils/sendResponse');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];

        if (!token) {
            return sendResponse(res, {
                status: 401,
                message: 'You are not logged in.',
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        const status = 403;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};

module.exports = verifyToken;
