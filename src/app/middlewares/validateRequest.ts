import { RequestHandler } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject): RequestHandler => {
    return catchAsync(async (req, _res, next) => {
        const parsed = await schema.parseAsync({
            body: req.body,
            cookies: req.cookies,
            query: req.query,
        });

        req.body = parsed.body;
        req.cookies = parsed.cookies;
        req.query = parsed.query;
        next();
    });
};

export default validateRequest;
