import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { USER_STATUS } from '../user/user.constant';
import { ILoginCredentials, IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { IChangePassword } from './auth.interface';
import { createToken } from './auth.util';

const signup = async (payload: IUser) => {
    const user = await User.findOne({ email: payload?.email });

    if (user) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'A user already exists with this email!',
        );
    }

    const newUser = await User.create(payload);

    return {
        statusCode: httpStatus.CREATED,
        message: 'User registered successfully',
        data: newUser,
    };
};

const login = async (payload: ILoginCredentials) => {
    const user = await User.findOne({ email: payload?.email }).select(
        '+password',
    );

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

    // check if the password matched
    const isPasswordMatched = await User.comparePassword(
        payload?.password,
        user?.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong user id or password');
    }

    const jwtPayload = {
        id: user._id,
        role: user.role,
    };

    // create access token
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_exp_in as string,
    );

    // create refresh token
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_exp_in as string,
    );

    user.password = undefined; // remove password field

    return {
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        token: accessToken,
        refreshToken,
        data: user,
    };
};

const refreshToken = async (token: string) => {
    const decoded = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;

    const user = await User.findById(decoded.id);

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

    const jwtPayload = {
        id: user._id,
        role: user.role,
    };

    // create access token
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_exp_in as string,
    );

    return {
        statusCode: httpStatus.OK,
        message: 'Successfully retrieved refresh token!',
        token: accessToken,
        data: null,
    };
};

const changePassword = async (
    decodedUser: JwtPayload,
    payload: IChangePassword,
) => {
    const user = await User.findById(decodedUser?.id).select('+password');

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isPasswordMatched = await User.comparePassword(
        payload?.currentPassword,
        user?.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Wrong password!');
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findByIdAndUpdate(
        decodedUser.id,
        {
            password: hashedPassword,
        },
        {
            new: true,
        },
    );

    return {
        statusCode: httpStatus.OK,
        message: 'Password changed successfully!',
        data: null,
    };
};

export const AuthServices = {
    signup,
    login,
    refreshToken,
    changePassword,
};
