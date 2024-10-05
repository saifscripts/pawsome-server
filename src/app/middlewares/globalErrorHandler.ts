import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import { JsonWebTokenError } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../errors/AppError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleJWTError from '../errors/handleJWTError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import { IErrorMessage } from '../interfaces/errors';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    // default error response
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Something went wrong!';
    let errorMessages: IErrorMessage[] = [
        {
            path: '',
            message: 'Something went wrong!',
        },
    ];

    // format and set response data based on the error type
    if (err instanceof ZodError) {
        const formattedError = handleZodError(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorMessages = formattedError.errorMessages;
    } else if (err instanceof mongoose.Error.ValidationError) {
        const formattedError = handleValidationError(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorMessages = formattedError.errorMessages;
    } else if (err instanceof mongoose.Error.CastError) {
        const formattedError = handleCastError(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorMessages = formattedError.errorMessages;
    } else if (err?.code === 11000) {
        const formattedError = handleDuplicateError(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorMessages = formattedError.errorMessages;
    } else if (err instanceof JsonWebTokenError) {
        const formattedError = handleJWTError(err);
        statusCode = formattedError.statusCode;
        message = formattedError.message;
        errorMessages = formattedError.errorMessages;
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorMessages = [
            {
                path: '',
                message: err.message,
            },
        ];
    } else if (err instanceof Error) {
        message = err.message;
        errorMessages = [
            {
                path: '',
                message: err.message,
            },
        ];
    }

    // send error response
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorMessages,
        stack: config.NODE_ENV === 'development' && err?.stack,
    });
};

export default globalErrorHandler;
