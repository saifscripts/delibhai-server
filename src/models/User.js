const mongoose = require('mongoose');
const validator = require('validator');
const isMobilePhone = require('../utils/isMobilePhone')

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
    unique: [true, 'User with this email already exist'],
    validate: [validator.isEmail, 'Email is not valid']
  },
  mobile: {
    type: String,
    require: [true, 'Mobile Number is required'],
    unique: [true, 'This mobile number is already in use'],
    validate: [isMobilePhone('bn-BD'), 'Mobile Number is invalid'],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: (value) =>
        validator.isStrongPassword(value, {
          minLength: 6,
          // minLowercase: 1,
          // minNumbers: 1,
          // minUppercase: 1,
          // minSymbols: 1,
        }),
      message: "Password is not strong enough.",
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
});

module.exports = mongoose.model('User', userSchema);
 