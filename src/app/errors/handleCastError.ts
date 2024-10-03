import { Error } from 'mongoose';
import { IErrorMessage, IErrorResponse } from '../interfaces/errors';

const handleCastError = (err: Error.CastError): IErrorResponse => {
    const errorMessages: IErrorMessage[] = [
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

export default handleCastError;
