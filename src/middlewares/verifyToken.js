const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];

        if (!token) {
            return res.send(401).json({
                success: false,
                message: 'You are not logged in',
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            error,
        });
    }
};

module.exports = verifyToken;
