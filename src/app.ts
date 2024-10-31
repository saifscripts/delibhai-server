import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app = express();

const corsOptions = {
    origin: [config.client_base_url as string],
    credentials: true,
};

// parsers
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/v1/', router);

// home route
app.get('/', (_req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: `App is running on port ${config.port}!`,
    });
});

// globalError handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
