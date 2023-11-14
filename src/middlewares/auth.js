// eslint-disable-next-line operator-linebreak
const auth =
    (...roles) =>
    (req, res, next) => {
        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access',
            });
        }
        next();
    };

exports = auth;
