import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

// Route: /api/v1/auth/signup (POST)
const signup = catchAsync(async (req, res) => {
    const result = await AuthServices.signup(req.body);
    sendResponse(res, result);
});

// Route: /api/v1/auth/login (POST)
const login = catchAsync(async (req, res) => {
    const result = await AuthServices.login(req.body);

    res.cookie('refreshToken', result.refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, result);
});

// Route: /api/v1/auth/refresh-token (POST)
const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
    sendResponse(res, result);
});

// Route: /api/v1/auth/change-password (PUT)
const changePassword = catchAsync(async (req, res) => {
    const result = await AuthServices.changePassword(req.user, req.body);
    sendResponse(res, result);
});

export const AuthControllers = {
    signup,
    login,
    refreshToken,
    changePassword,
};
