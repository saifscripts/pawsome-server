import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { USER_STATUS } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const verifyToken = (): RequestHandler => {
    return catchAsync(async (req, _res, next) => {
        const token = req.headers?.authorization?.split?.(' ')?.[1];

        if (!token) {
            next();
            return;
        }

        // decode the token
        try {
            const decoded = jwt.verify(
                token,
                config.jwt_access_secret as string,
            ) as JwtPayload;

            const { id } = decoded;

            const user = await User.findById(id);

            // check if user exists
            if (!user) {
                next();
                return;
            }

            // check if the user is deleted
            if (user.isDeleted) {
                next();
                return;
            }

            // check if the user is blocked
            if (user.status === USER_STATUS.BLOCKED) {
                next();
                return;
            }
            req.user = decoded;
            next();
        } catch {
            next();
        }
    });
};

export default verifyToken;
