"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomNumber = (digit = 6) => {
    let otp = '';
    for (let i = 0; i < digit; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};
exports.default = generateRandomNumber;
