"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleJWTError = (err) => {
    const errorSources = [
        {
            path: '',
            message: err.message,
        },
    ];
    return {
        statusCode: 401,
        message: err.message,
        errorSources,
    };
};
exports.default = handleJWTError;
