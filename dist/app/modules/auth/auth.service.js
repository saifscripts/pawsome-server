"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendMail_1 = require("../../utils/sendMail");
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const auth_util_1 = require("./auth.util");
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'A user already exists with this email!');
    }
    const newUser = yield user_model_1.User.create(payload);
    const jwtPayload = {
        _id: newUser === null || newUser === void 0 ? void 0 : newUser._id,
        role: newUser === null || newUser === void 0 ? void 0 : newUser.role,
        name: newUser === null || newUser === void 0 ? void 0 : newUser.name,
        email: newUser === null || newUser === void 0 ? void 0 : newUser.email,
        phone: newUser === null || newUser === void 0 ? void 0 : newUser.phone,
        avatarURL: newUser === null || newUser === void 0 ? void 0 : newUser.avatarURL,
    };
    // create access token
    const accessToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_exp_in);
    // create refresh token
    const refreshToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_exp_in);
    return {
        statusCode: http_status_1.default.CREATED,
        message: 'User registered successfully',
        data: {
            accessToken,
            refreshToken,
        },
    };
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }).select('+password');
    // check if user exists
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check if the user is deleted
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check if the user is blocked
    if (user.status === user_constant_1.USER_STATUS.BLOCKED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is blocked!');
    }
    // check if the password matched
    const isPasswordMatched = yield user_model_1.User.comparePassword(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong user id or password');
    }
    const jwtPayload = {
        _id: user === null || user === void 0 ? void 0 : user._id,
        role: user === null || user === void 0 ? void 0 : user.role,
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        phone: user === null || user === void 0 ? void 0 : user.phone,
        avatarURL: user === null || user === void 0 ? void 0 : user.avatarURL,
    };
    // create access token
    const accessToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_exp_in);
    // create refresh token
    const refreshToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_exp_in);
    user.password = undefined; // remove password field
    return {
        statusCode: http_status_1.default.OK,
        message: 'User logged in successfully',
        data: {
            accessToken,
            refreshToken,
        },
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const user = yield user_model_1.User.findById(decoded.id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check if the user is deleted
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // check if the user is blocked
    if (user.status === user_constant_1.USER_STATUS.BLOCKED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is blocked!');
    }
    const jwtPayload = {
        _id: user === null || user === void 0 ? void 0 : user._id,
        role: user === null || user === void 0 ? void 0 : user.role,
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        phone: user === null || user === void 0 ? void 0 : user.phone,
        avatarURL: user === null || user === void 0 ? void 0 : user.avatarURL,
    };
    // create access token
    const accessToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_exp_in);
    return {
        statusCode: http_status_1.default.OK,
        message: 'Successfully retrieved refresh token!',
        token: accessToken,
        data: null,
    };
});
const changePassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const isPasswordMatched = yield user_model_1.User.comparePassword(payload === null || payload === void 0 ? void 0 : payload.currentPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Wrong password!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
    }, {
        new: true,
    });
    return {
        statusCode: http_status_1.default.OK,
        message: 'Password changed successfully!',
        data: null,
    };
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User not found!');
    }
    if ((user === null || user === void 0 ? void 0 : user.status) === user_constant_1.USER_STATUS.BLOCKED) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'The user is blocked!');
    }
    const jwtPayload = {
        id: user._id,
        role: user.role,
    };
    // create reset token
    const resetToken = (0, auth_util_1.createToken)(jwtPayload, config_1.default.jwt_reset_secret, config_1.default.jwt_reset_exp_in);
    const resetUILink = `${config_1.default.client_base_url}/reset-password?token=${resetToken} `;
    const result = yield (0, sendMail_1.sendMail)({
        from: config_1.default.mail_auth_user,
        to: email,
        subject: `Password Reset Link`,
        html: resetUILink,
    });
    if (!result.messageId) {
        throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Fail to send email!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Reset link sent successfully. Check your mail.',
        data: null,
    };
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, token } = payload;
    if (!token) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized!');
    }
    const decodedUser = jsonwebtoken_1.default.verify(token, config_1.default.jwt_reset_secret);
    const user = yield user_model_1.User.findById(decodedUser.id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User not found!');
    }
    if ((user === null || user === void 0 ? void 0 : user.status) === user_constant_1.USER_STATUS.BLOCKED) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'The user is blocked!');
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(decodedUser.id, {
        password: hashedPassword,
    }, { new: true });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to reset password!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Password reset successfully!',
        data: updatedUser,
    };
});
exports.AuthServices = {
    register,
    login,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
