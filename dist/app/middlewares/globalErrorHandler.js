"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = require("jsonwebtoken");
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const handleJWTError_1 = __importDefault(require("../errors/handleJWTError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const globalErrorHandler = (err, _req, res, _next) => {
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong!',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const formattedError = (0, handleZodError_1.default)(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorSources = formattedError.errorSources;
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        const formattedError = (0, handleValidationError_1.default)(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorSources = formattedError.errorSources;
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        const formattedError = (0, handleCastError_1.default)(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorSources = formattedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const formattedError = (0, handleDuplicateError_1.default)(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorSources = formattedError.errorSources;
    }
    else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        const formattedError = (0, handleJWTError_1.default)(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorSources = formattedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err.message,
            },
        ];
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config_1.default.NODE_ENV === 'development' ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;
