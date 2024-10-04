import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { USER_STATUS } from '../modules/user/user.constant';
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

        // get the token from the auth header
        const token = authHeader.split(' ')[1];

        // check if there is a token
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

        const { id } = decoded;

        const user = await User.findById(id);

        // check if user exists
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
        }

        // check if the user is deleted
        if (user.isDeleted) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
        }

        // check if the user is blocked
        if (user.status === USER_STATUS.BLOCKED) {
            throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!');
        }

        // check if the user is authorized
        if (authorizedRoles && !authorizedRoles.includes(user.role)) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'You are not authorized!',
            );
        }

        req.user = user;
        next();
    });
};

export default auth;
