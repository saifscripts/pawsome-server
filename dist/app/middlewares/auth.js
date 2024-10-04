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
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const user_constant_1 = require("../modules/user/user.constant");
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...authorizedRoles) => {
    return (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        // check if auth header is sent
        if (!authHeader) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        // get the token from the auth header
        const token = authHeader.split(' ')[1];
        // check if there is a token
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        // decode the token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { id } = decoded;
        const user = yield user_model_1.User.findById(id).select('+password');
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
        // check if the user is authorized
        if (authorizedRoles && !authorizedRoles.includes(user.role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        req.user = user;
        next();
    }));
};
exports.default = auth;
