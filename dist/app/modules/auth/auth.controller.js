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
exports.AuthControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
// Route: /api/v1/auth/register (POST)
const register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.register(req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/auth/login (POST)
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.login(req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/auth/refresh-token (POST)
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/auth/change-password (PUT)
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.changePassword(req.user._id, req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/auth/forget-password (POST)
const forgetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.forgetPassword(req.body.email);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/auth/reset-password (PUT)
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.resetPassword(req.body);
    (0, sendResponse_1.default)(res, result);
}));
exports.AuthControllers = {
    register,
    login,
    refreshToken,
    changePassword,
    forgetPassword,
    resetPassword,
};
