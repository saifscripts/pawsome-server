export type IErrorMessage = {
    path: string | number;
    message: string;
};

export interface IErrorResponse {
    statusCode: number;
    message: string;
    errorMessages: IErrorMessage[];
}

export interface IDuplicateError extends Error {
    code: number;
    keyValue: { [key: string]: string };
    errmsg?: string;
}
