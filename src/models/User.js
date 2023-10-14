const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcryptjs");
const {isMobilePhone} = require('../utils/isMobilePhone');
const { generateOTP } = require('../utils/generateOTP');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [3, 'Name must contain at least 3 character']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['পুরুষ', 'মহিলা', 'অন্যান্য'],
      message: '{VALUE} is an invalid gender. Gender must be পুরুষ/মহিলা/অন্যান্য'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Email is not valid']
  },
  mobile: {
    type: String,
    require: [true, 'Mobile Number is required'],
    unique: true,
    validate: [isMobilePhone('bn-BD'), 'Mobile Number is invalid'],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: (value) =>
        validator.isStrongPassword(value, {
          minLength: 4,
          minLowercase: 0,
          minNumbers: 0,
          minUppercase: 0,
          minSymbols: 0,
        }),
      message: "Password must be at least 4 characters",
    },
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords don't match!",
    },
  },
  role: {
    type: String,
    enum: ["user", "hero", "admin"],
    default: "hero"
  },
  status: {
    type: String,
    enum: ['inactive', 'active', 'verified'],
    default: 'inactive'
  },
  image: {
    type: String,
    validate: [validator.isURL, "Please provide a valid url"],
  },
  
  otp: String,
  otpExpires: Date,

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
},{
  timestamps: true
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    //  only run if password is modified, otherwise it will change every time we save the user!
    return next();
  }
  const password = this.password;

  const hashedPassword = bcrypt.hashSync(password);

  this.password = hashedPassword;
  this.confirmPassword = undefined;

  next();
});

// Set default role (this stops users updating the role directly);
userSchema.pre("save", function (next) {
  if (!this.isModified("role")) {
    //  only run if role is modified, otherwise it will change every time we save the user!
    return next();
  }
  this.role = 'hero'

  next();
});

// Set default status (this stops users updating the status directly);
userSchema.pre("save", function (next) {
  if (!this.isModified("status")) {
    //  only run if role is modified, otherwise it will change every time we save the user!
    return next();
  }
  this.status = 'inactive'

  next();
});

// Set default status (this stops users updating the status directly);
userSchema.pre("save", function (next) {
  if (!this.isModified("mobile")) {
    //  only run if role is modified, otherwise it will change every time we save the user!
    return next();
  }

  let mobile = this.mobile;

  if (mobile.startsWith('+88')) {
    mobile = mobile.slice(3);
  } else if (mobile.startsWith('88')) {
    mobile = mobile.slice(2);
  }

  this.mobile = mobile;

  next();
});

userSchema.methods.generateOTP = function () {
  const otp = generateOTP(6);

  this.otp = otp;

  const date = new Date();

  date.setMinutes(date.getMinutes() + 1);
  this.otpExpires = date;

  return otp;
};


module.exports = mongoose.model('User', userSchema);
 