const mongoose = require('mongoose');
const validator = require('validator');
const {isMobilePhone} = require('../utils/isMobilePhone')

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

module.exports = mongoose.model('User', userSchema);
 