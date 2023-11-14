const {
    getAllUsersService,
    signupService,
    getUserByEmailService,
    getUserByIdService,
    updateUserByIdService,
    getUserByMobileService,
} = require('../services/user.service');
const { generateToken } = require('../utils/generateToken');
const sendResponse = require('../utils/sendResponse');

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
        // Extract userInfo from req.body to prevent inserting unwanted fields
        const { name, gender, email, mobile, password, confirmPassword } = req.body;
        const userInfo = {
            name,
            gender,
            email,
            mobile,
            password,
            confirmPassword,
        };

        // Check if user already exist with this email
        let user = await getUserByEmailService(email);

        // Send error response if user exist
        if (user) {
            const message =
                user.status === 'inactive'
                    ? "can't use this email right now. try again later"
                    : 'a user already exist with this email address';

            return sendResponse(res, { status: 409, message, code: 'duplicateEmail' });
        }

        // Create user
        user = await signupService(userInfo);

        // Generate otp
        const otp = user.generateOTP();

        // Save the mobile number as tempMobile
        user.saveTempMobile();

        // Update the user with tempMobile, otp and otpExpires
        user = await user.save({ validateBeforeSave: false });

        // Send otp to the user's phone number
        // await sendSMS(`Verification Code: ${otp}`, user.tempMobile);
        console.log(otp);

        // Send success response
        sendResponse(res, {
            status: 200,
            message: 'user signed up successfully',
            data: { id: user.id },
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error';
        sendResponse(res, { status, message, error });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { id, otp } = req.body;

        const user = await getUserByIdService(id);

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                error: 'Wrong OTP',
            });
        }

        if (user.otpExpires.getTime() < Date.now()) {
            return res.status(400).json({
                success: false,
                error: 'OTP Expired',
            });
        }

        const { modifiedCount } = await updateUserByIdService(id, {
            status: 'active',
        });

        if (!modifiedCount) {
            return res.status(400).json({
                success: false,
                error: 'Internal Server Error',
            });
        }

        user.removeOTP();
        user.removeTempMobile();
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

exports.getMe = async (req, res) => {
    try {
        const user = await getUserByIdService(req.user._id);

        res.status(200).json({
            success: true,
            message: 'Successfully logged in',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
