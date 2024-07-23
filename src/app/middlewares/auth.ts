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
        const authHeader = req.headers.authorization;

        // check if auth header is sent
        if (!authHeader) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        // split and retrieve token
        const token = authHeader.split(' ')[1];

        // check if token is present
        if (!token) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        // decode the token
        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string,
        ) as JwtPayload;

        const { id, role, iat } = decoded;

        // find the decoded user
        const user = await User.findById(id);

        // check if user exists
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
        }

        // check if user is deleted
        const isDeleted = user?.isDeleted;

        if (isDeleted) {
            throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
        }

        // check if user is blocked
        const userStatus = user?.status;

        if (userStatus === 'blocked') {
            throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');
        }

        // check if the token is issued before password changed
        if (
            user.passwordChangedAt &&
            User.isJWTIssuedBeforePasswordChange(
                iat as number,
                user.passwordChangedAt,
            )
        ) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        // check if user is authorized based on the role
        if (authorizedRoles && !authorizedRoles.includes(role)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        req.user = decoded;
        next();
    });
};

export default auth;
