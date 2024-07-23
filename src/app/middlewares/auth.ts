import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { IUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...authorizedRoles: IUserRole[]): RequestHandler => {
    return catchAsync(async (req, _res, next) => {
        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as JwtPayload;

        const { id, role, iat } = decoded;

        const user = await User.findOne({ id });

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
        }

        const isDeleted = user?.isDeleted;

        if (isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
        }

        const userStatus = user?.status;

        if (userStatus === 'block') {
            throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
        }

        if (
            user.passwordChangedAt &&
            User.isJWTIssuedBeforePasswordChange(
                iat as number,
                user.passwordChangedAt,
            )
        ) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!!!',
            );
        }

        if (authorizedRoles && !authorizedRoles.includes(role)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!!',
            );
        }

        req.user = decoded;
        next();
    });
};

export default auth;
