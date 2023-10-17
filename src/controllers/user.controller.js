const User = require("../models/User");
const { getAllUsersService, signupService,getUserByIdService } = require("../services/user.service");
const { generateOTP } = require("../utils/generateOTP");
const { sendSMS } = require("../utils/sendSMS");

exports.getAllUsers = async(req, res) => {
  const users = await getAllUsersService();
  res.json(users);
}

exports.getUserById = async(req, res) => {
  try {
    const {id} = req.params;
    console.log(id)
    const user = await getUserByIdService(id);

    if(!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with this id"
      })
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

exports.signup = async(req, res) => {
  try {
    const user = await signupService(req.body);

    const otp = user.generateOTP();

    await user.save({ validateBeforeSave: false });

    const {sid} = await sendSMS(`Verification Code: ${otp}`, user.mobile);
    console.log(sid);

    res.status(200).json({
      success: true,
      userId: user._id,
      message: 'User signed up successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

exports.verifyOTP = async(req, res) => {
  try {
    const {id, otp} = req.body;

    const user = await getUserByIdService(id);

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Wrong OTP"
      })
    }

    if (user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired"
      })
    }

    // user.status = "active";
    // user.otp = undefined;
    // user.otpExpires = undefined;

    const {modifiedCount} = await User.updateOne({_id: id}, {$set: {
      status: "active",
      otp: null,
      otpExpires: null
    }});
    
    if (!modifiedCount) {
      return res.status(400).json({
        success: false,
        message: "OTP verification failed"
      })
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
