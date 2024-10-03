"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, responseData) => {
    const { statusCode, message, token, data, meta } = responseData;
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 400,
        statusCode,
        message,
        token,
        data,
        meta,
    });
};
exports.default = sendResponse;
