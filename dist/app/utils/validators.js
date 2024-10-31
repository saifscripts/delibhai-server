"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNID = void 0;
const isNID = (nid) => {
    // Check if the NID is a string of 10, 13, or 17 digits
    if (/^\d{10}$|^\d{13}$|^\d{17}$/.test(nid)) {
        if (nid.length === 17) {
            const birthYear = Number(nid.substring(0, 4));
            if (!(birthYear >= 1900 && birthYear <= new Date().getFullYear())) {
                return false;
            }
        }
        return true;
    }
    return false;
};
exports.isNID = isNID;
