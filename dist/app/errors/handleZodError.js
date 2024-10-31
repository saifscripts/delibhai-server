"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const errorSources = err.issues.map((issue) => ({
        path: issue === null || issue === void 0 ? void 0 : issue.path[(issue === null || issue === void 0 ? void 0 : issue.path.length) - 1],
        message: issue === null || issue === void 0 ? void 0 : issue.message,
    }));
    return {
        statusCode: 400,
        message: 'Validation Error!',
        errorSources,
    };
};
exports.default = handleZodError;
