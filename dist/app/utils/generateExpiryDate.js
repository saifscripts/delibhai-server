"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateExpiryDate = (minutes = 1) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
};
exports.default = generateExpiryDate;
