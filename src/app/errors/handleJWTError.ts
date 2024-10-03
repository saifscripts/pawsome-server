import { JsonWebTokenError } from 'jsonwebtoken';
import { IErrorMessage, IErrorResponse } from '../interfaces/errors';

const handleJWTError = (err: JsonWebTokenError): IErrorResponse => {
    const errorMessages: IErrorMessage[] = [
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

export default handleJWTError;
