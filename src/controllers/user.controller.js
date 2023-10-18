const {
    getAllUsersService,
    signupService,
    getUserByIdService,
    updateUserByIdService,
    getUserByMobileService,
} = require('../services/user.service');
const { generateToken } = require('../utils/generateToken');
const { sendSMS } = require('../utils/sendSMS');

exports.getAllUsers = async (req, res) => {
    const users = await getAllUsersService();
    res.json(users);
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const user = await getUserByIdService(id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'No user found with this id',
            });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.signup = async (req, res) => {
    try {
        const user = await signupService(req.body);

        const otp = user.generateOTP();

        await user.save({ validateBeforeSave: false });

        await sendSMS(`Verification Code: ${otp}`, user.mobile);

        res.status(200).json({
            success: true,
            userId: user._id,
            message: 'User signed up successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { id, otp } = req.body;

        const user = await getUserByIdService(id);

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Wrong OTP',
            });
        }

        if (user.otpExpires.getTime() < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP Expired',
            });
        }

        const { modifiedCount } = await updateUserByIdService(id, {
            status: 'active',
        });

        if (!modifiedCount) {
            return res.status(400).json({
                success: false,
                message: 'Internal Server Error',
            });
        }

        user.removeOTP();
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'OTP verified',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your credentials',
            });
        }

        const user = await getUserByMobileService(mobile);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist with this mobile number",
            });
        }

        const isPasswordMatched = user.comparePassword(password, user.password);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect Mobile/Password',
            });
        }

        if (user.status === 'inactive') {
            return res.status(400).json({
                success: false,
                message: 'Your mobile number is not verified. Please verify your mobile number',
            });
        }

        const token = generateToken(user);

        // remove password before sending
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Successfully logged in',
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
