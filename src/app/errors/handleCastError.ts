import { Error } from 'mongoose';
import { IErrorResponse, IErrorSources } from '../interfaces/errors';

const handleCastError = (err: Error.CastError): IErrorResponse => {
    const errorSources: IErrorSources = [
        {
            path: err.path,
            message: err.message,
        },
    ];

    return {
        statusCode: 400,
        message: 'Invalid ID!',
        errorSources,
    };
};

export default handleCastError;
