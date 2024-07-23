import { Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (_req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'No route found!',
    });
};

export default notFound;
