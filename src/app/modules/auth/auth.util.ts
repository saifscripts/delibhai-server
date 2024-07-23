import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
    payload: JwtPayload,
    secret: string,
    expiresIn: string,
) =>
    jwt.sign(payload, secret, {
        expiresIn,
    });
