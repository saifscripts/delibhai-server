import { JsonWebTokenError } from 'jsonwebtoken';
import { IErrorResponse, IErrorSources } from '../interfaces/errors';

const handleJWTError = (err: JsonWebTokenError): IErrorResponse => {
    const errorSources: IErrorSources = [
        {
            path: '',
            message: err.message,
        },
    ];

    return {
        statusCode: 401,
        message: err.message,
        errorSources,
    };
};

export default handleJWTError;
