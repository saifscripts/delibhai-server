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
    sendResponse(res, { status: 200, data: users });
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(id);

        if (!user) {
            return sendResponse(res, {
                status: 400,
                message: 'No user found with this id!',
            });
        }

        sendResponse(res, {
            status: 200,
            data: user,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
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
                    ? "Can't use this email right now. Please Try again later."
                    : 'A user already exist with this email address.';

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
            message: 'User signed up successfully!',
            data: { id: user.id },
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { id, otp } = req.body;

        const user = await getUserByIdService(id);

        if (!user) {
            return sendResponse(res, {
                status: 400,
                message: "User ID doesn't exist!",
            });
        }

        if (user.otp !== otp) {
            return sendResponse(res, { status: 400, message: 'Wrong OTP!' });
        }

        if (user.otpExpires.getTime() < Date.now()) {
            return sendResponse(res, { status: 400, message: 'OTP Expired!' });
        }

        // Make user status 'active'
        const { modifiedCount } = await updateUserByIdService(id, {
            status: 'active',
        });

        if (!modifiedCount) {
            return sendResponse(res, { status: 500, message: 'Internal Server Error!' });
        }

        user.removeOTP();
        user.removeTempMobile(); // Add mobile field and remove tempMobile field
        await user.save({ validateBeforeSave: false });

        sendResponse(res, { status: 200, message: 'OTP verified!' });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};

exports.login = async (req, res) => {
    try {
        const { mobile, password } = req.body;

        if (!mobile || !password) {
            return sendResponse(res, { status: 400, message: 'Please provide your credentials.' });
        }

        // Slice mobile to remove Country Code and find the user
        const user = await getUserByMobileService(mobile.slice(-11));

        if (!user) {
            return sendResponse(res, {
                status: 400,
                message: "User doesn't exist with this mobile number.",
                code: 'mobileNotExist',
            });
        }

        const isPasswordMatched = user.comparePassword(password, user.password);

        if (!isPasswordMatched) {
            return sendResponse(res, {
                status: 400,
                message: 'Incorrect Mobile/Password.',
            });
        }

        if (user.status === 'inactive') {
            return sendResponse(res, {
                status: 400,
                message: 'Your mobile number is not verified. Please verify your mobile number.',
            });
        }

        const token = generateToken(user);

        // remove password before sending response
        user.password = undefined;

        sendResponse(res, {
            status: 200,
            message: 'Successfully logged in!',
            data: { user, token },
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await getUserByIdService(req.user._id);

        sendResponse(res, {
            status: 200,
            message: 'Successfully logged in!',
            data: user,
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        console.log('here');
        // Get the corresponding user to resend OTP
        const { id } = req.params;
        let user = await getUserByIdService(id);

        // Send error response if no user found
        if (!user) {
            return sendResponse(res, {
                status: 400,
                message: 'User not found!',
            });
        }

        // If tempMobile field is not available, there is nothing to verify
        if (!user?.tempMobile) {
            return sendResponse(res, {
                status: 400,
                message: 'OTP already verified.',
                code: 'OTP_ALREADY_VERIFIED',
            });
        }

        // Previous OTP must be expired to resend a new OTP
        if (user.otpExpires.getTime() > Date.now()) {
            return sendResponse(res, { status: 400, message: "Previous OTP isn't expired yet!" });
        }

        // Generate otp
        const otp = user.generateOTP();

        // Update the user with otp and otpExpires
        user = await user.save({ validateBeforeSave: false });

        // Send otp to the user's phone number
        // await sendSMS(`Verification Code: ${otp}`, user.tempMobile);
        console.log(otp);

        // Send success response
        sendResponse(res, {
            status: 200,
            message: 'OTP sent!',
            data: { id: user.id },
        });
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || 'Internal Server Error!';
        sendResponse(res, { status, message, error });
    }
};
