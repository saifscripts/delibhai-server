export type IErrorSources = {
    path: string | number;
    message: string;
}[];

export interface IErrorResponse {
    statusCode: number;
    message: string;
    errorSources: IErrorSources;
}

export interface IDuplicateError extends Error {
    code: number;
    keyValue: { [key: string]: string };
    errmsg?: string;
}
