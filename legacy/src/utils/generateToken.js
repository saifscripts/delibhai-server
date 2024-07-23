const jwt = require('jsonwebtoken');

exports.generateToken = (userInfo) => {
    const { _id, mobile, role } = userInfo;
    const payload = { _id, mobile, role };

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30d',
    });

    return token;
};
