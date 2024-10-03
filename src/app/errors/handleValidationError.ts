import { Error } from 'mongoose';
import { IErrorMessage, IErrorResponse } from '../interfaces/errors';

const handleValidationError = (err: Error.ValidationError): IErrorResponse => {
    const errorMessages: IErrorMessage[] = Object.values(err.errors).map(
        (val: Error.ValidatorError | Error.CastError) => ({
            path: val?.path,
            message: val.message,
        }),
    );

    return {
        statusCode: 400,
        message: 'Validation Error!',
        errorMessages,
    };
};

export default handleValidationError;
