"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleJWTError = (err) => {
    const errorMessages = [
        {
            path: '',
            message: err.message,
        },
    ];
    return {
        statusCode: 401,
        message: err.message,
        errorMessages,
    };
};
exports.default = handleJWTError;
