"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const errorMessages = [
        {
            path: err.path,
            message: err.message,
        },
    ];
    return {
        statusCode: 400,
        message: 'Invalid ID!',
        errorMessages,
    };
};
exports.default = handleCastError;
