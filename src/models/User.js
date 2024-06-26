const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { isMobilePhone } = require('../utils/isMobilePhone');
const { generateOTP } = require('../utils/generateOTP');
const { isNID } = require('../utils/isNID');

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    // PERSONAL INFO
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required.'],
      minLength: [3, 'Name must be at least 3 characters long.'],
    },
    fatherName: {
      type: String,
      trim: true,
      minLength: [3, 'Name must be at least 3 characters long.'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required.'],
      enum: {
        values: ['পুরুষ', 'মহিলা', 'অন্যান্য'],
        message:
          '{VALUE} is an invalid gender. Gender must be পুরুষ/মহিলা/অন্যান্য.',
      },
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['এ+', 'বি+', 'এবি+', 'ও+', 'এ-', 'বি-', 'এবি-', 'ও-'],
        message: '{VALUE} is an invalid blood group.',
      },
    },
    age: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
    },
    nid: {
      type: String,
      validate: [isNID, 'NID is not valid.'],
    },
    nidURL: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid url.'],
    },
    // CONTACT INFO
    mobile: {
      type: String,
      trim: true,
      required: [true, 'Mobile number is required.'],
      unique: true,
      sparse: true,
      validate: [isMobilePhone('bn-BD'), 'Mobile number is invalid.'],
    },
    tempMobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      validate: [isMobilePhone('bn-BD'), 'Mobile number is invalid.'],
    },
    altMobile: {
      type: String,
      trim: true,
      validate: [isMobilePhone('bn-BD'), 'Mobile number is invalid.'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email is not valid.'],
    },
    facebookURL: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid url.'],
    },
    // ADDRESS INFO
    presentAddress: {
      division: { type: ObjectId, ref: 'Division' },
      district: { type: ObjectId, ref: 'District' },
      upazila: { type: ObjectId, ref: 'Upazila' },
      union: { type: ObjectId, ref: 'Union' },
      village: { type: ObjectId, ref: 'Village' },
    },
    permanentAddress: {
      division: { type: ObjectId, ref: 'Division' },
      district: { type: ObjectId, ref: 'District' },
      upazila: { type: ObjectId, ref: 'Upazila' },
      union: { type: ObjectId, ref: 'Union' },
      village: { type: ObjectId, ref: 'Village' },
    },
    // VEHICLE INFO
    vehicleType: {
      type: String,
      trim: true,
    },
    vehicleBrand: {
      type: String,
      trim: true,
    },
    vehicleModel: {
      type: String,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      trim: true,
    },
    vehicleName: {
      type: String,
      trim: true,
    },
    // OWNER INFO
    ownerName: {
      type: String,
      trim: true,
      minLength: [3, 'Name must be at least 3 characters long.'],
    },
    ownerAddress: {
      division: { type: ObjectId, ref: 'Division' },
      district: { type: ObjectId, ref: 'District' },
      upazila: { type: ObjectId, ref: 'Upazila' },
      union: { type: ObjectId, ref: 'Union' },
      village: { type: ObjectId, ref: 'Village' },
    },
    ownerMobile: {
      type: String,
      trim: true,
      validate: [isMobilePhone('bn-BD'), 'Mobile number is invalid.'],
    },
    ownerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email is not valid.'],
    },
    // VEHICLE PHOTOS
    vehiclePhotos: {
      type: [
        {
          type: String,
          validate: [validator.isURL, 'Please provide a valid url.'],
        },
      ],
      validate: {
        validator: (value) => value.length <= 4,
        message: '{PATH} exceeds the limit of 4',
      },
    },
    // SERVICE INFO{}
    serviceUsage: {
      type: String,
      enum: {
        values: ['ব্যক্তিগত', 'ভাড়ায় চালিত'],
        message: '{VALUE} is an invalid service usage.',
      },
    },
    serviceType: {
      type: String,
      enum: {
        values: [
          'লোকাল ভাড়া',
          'রিজার্ভ ভাড়া',
          'লোকাল ও রিজার্ভ ভাড়া',
          'কন্টাক্ট ভাড়া',
        ],
        message: '{VALUE} is an invalid service type.',
      },
    },
    mainStation: {
      division: { type: ObjectId, ref: 'Division' },
      district: { type: ObjectId, ref: 'District' },
      upazila: { type: ObjectId, ref: 'Upazila' },
      union: { type: ObjectId, ref: 'Union' },
      village: { type: ObjectId, ref: 'Village' },
    },
    serviceAddress: [
      {
        division: { type: ObjectId, ref: 'Division' },
        district: { type: ObjectId, ref: 'District' },
        upazila: { type: ObjectId, ref: 'Upazila' },
        union: { type: ObjectId, ref: 'Union' },
        village: [{ type: ObjectId, ref: 'Village' }],
      },
    ],
    serviceTimes: {
      type: [
        {
          start: String,
          end: String,
        },
      ],
    },
    serviceStatus: {
      type: String,
      enum: {
        values: ['off', 'scheduled', 'on'],
        message: '{VALUE} is an invalid service status.',
      },
      default: 'scheduled',
    },
    // LOCATION INFO
    liveLocation: {
      latitude: Number,
      longitude: Number,
      timestamp: Number,
    },
    manualLocation: {
      latitude: Number,
      longitude: Number,
    },
    // VIDEO URL
    videoURL: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid url.'],
    },
    // OTHERS
    password: {
      type: String,
      required: [true, 'Password is required.'],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 4,
            minLowercase: 0,
            minNumbers: 0,
            minUppercase: 0,
            minSymbols: 0,
          }),
        message: 'Password must be at least 4 characters long.',
      },
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator(value) {
          return value === this.password;
        },
        message: "Passwords don't match.",
      },
    },
    role: {
      type: String,
      enum: ['user', 'hero', 'admin'],
      default: 'hero',
    },
    status: {
      type: String,
      enum: ['inactive', 'active', 'verified'],
      default: 'inactive',
    },
    avatarURL: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid url.'],
    },
    avatarSrcURL: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid url.'],
    },
    avatarCropData: {
      unit: String,
      x: Number,
      y: Number,
      width: Number,
      height: Number,
    },

    otp: String,
    otpExpires: Date,
    otpSessionExpires: Date,

    // passwordChangedAt: Date,
    // passwordResetToken: String,
    // passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Generate hashedPassword and remove confirmPassword
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next(); // Escape this method when password isn't modified
  }

  const { password } = this;
  const hashedPassword = bcrypt.hashSync(password);

  this.password = hashedPassword;
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.saveTempMobile = function () {
  this.tempMobile = this.mobile.slice(-11);
  this.mobile = undefined;
};

userSchema.methods.removeTempMobile = function () {
  this.mobile = this.tempMobile;
  this.tempMobile = undefined;
};

userSchema.methods.generateOTP = function () {
  const otp = generateOTP(6);

  this.otp = otp;

  const otpExpires = new Date();
  otpExpires.setMinutes(otpExpires.getMinutes() + 1);
  this.otpExpires = otpExpires;

  const otpSessionExpires = new Date();
  otpSessionExpires.setMinutes(otpSessionExpires.getMinutes() + 10);
  this.otpSessionExpires = otpSessionExpires;

  return otp;
};

userSchema.methods.removeOTP = function () {
  this.otp = undefined;
  this.otpExpires = undefined;
  this.otpSessionExpires = undefined;
};

userSchema.methods.comparePassword = function (password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = mongoose.model('User', userSchema);
