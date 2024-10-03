import { ZodError, ZodIssue } from 'zod';
import { IErrorMessage, IErrorResponse } from '../interfaces/errors';

const handleZodError = (err: ZodError): IErrorResponse => {
    const errorMessages: IErrorMessage[] = err.issues.map(
        (issue: ZodIssue) => ({
            path: issue?.path[issue?.path.length - 1],
            message: issue?.message,
        }),
    );

    return {
        statusCode: 400,
        message: 'Validation Error!',
        errorMessages,
    };
};

export default handleZodError;
