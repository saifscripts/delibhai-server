import { Request, Response } from 'express';
import httpStatus from 'http-status';

const test = (_req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: 'App is running successfully!',
    });
};

export default test;
