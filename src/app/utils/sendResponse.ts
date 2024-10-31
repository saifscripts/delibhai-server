import { Response } from 'express';

interface ResponseData<T> {
    statusCode: number;
    message: string;
    data: T;
}

const sendResponse = <T>(res: Response, data: ResponseData<T>) => {
    const { statusCode, message } = data;

    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 400,
        message,
        data: data.data,
    });
};

export default sendResponse;
