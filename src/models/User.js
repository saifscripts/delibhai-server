const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { isMobilePhone } = require('../utils/isMobilePhone');
const { generateOTP } = require('../utils/generateOTP');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'name is required'],
            minLength: [3, 'name must be at least 3 characters long'],
        },
        gender: {
            type: String,
            trim: true,
            required: [true, 'gender is required'],
            enum: {
                values: ['পুরুষ', 'মহিলা', 'অন্যান্য'],
                message: '{VALUE} is an invalid gender. Gender must be পুরুষ/মহিলা/অন্যান্য',
            },
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: [validator.isEmail, 'email is not valid'],
        },
        mobile: {
            type: String,
            trim: true,
            required: [true, 'mobile number is required'],
            unique: true,
            sparse: true,
            validate: [isMobilePhone('bn-BD'), 'mobile number is invalid'],
        },
        tempMobile: {
            type: String,
            trim: true,
            validate: [isMobilePhone('bn-BD'), 'mobile number is invalid'],
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            validate: {
                validator: (value) =>
                    validator.isStrongPassword(value, {
                        minLength: 4,
                        minLowercase: 0,
                        minNumbers: 0,
                        minUppercase: 0,
                        minSymbols: 0,
                    }),
                message: 'password must be at least 4 characters long',
            },
        },
        confirmPassword: {
            type: String,
            required: [true, 'please confirm your password'],
            validate: {
                validator(value) {
                    return value === this.password;
                },
                message: "passwords don't match",
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
        image: {
            type: String,
            validate: [validator.isURL, 'Please provide a valid url'],
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
    },
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

// // Remove Country Code from Mobile Number
// userSchema.pre('save', function (next) {
//     if (!this.isModified('mobile')) {
//         return next(); // Escape this method when mobile isn't modified
//     }

//     this.tempMobile = this.mobile.slice(-11);
//     this.mobile = undefined;

//     next();
// });

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
    otpSessionExpires.setMinutes(otpSessionExpires.getMinutes() + 2);
    this.otpSessionExpires = otpSessionExpires;

    return otp;
};

userSchema.methods.removeOTP = function () {
    this.otp = undefined;
    this.otpExpires = undefined;
    this.otpSessionExpires = undefined;
};

// userSchema.methods.otpExpired = function () {
//     if (!this.otpExpired) return false;
//     return this.otpExpires?.getTime() < Date.now();
// };

userSchema.methods.comparePassword = function (password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
};

module.exports = mongoose.model('User', userSchema);
