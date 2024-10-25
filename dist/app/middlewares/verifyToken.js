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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user_constant_1 = require("../modules/user/user.constant");
const user_model_1 = require("../modules/user/user.model");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const verifyToken = (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const token = (_d = (_c = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split) === null || _c === void 0 ? void 0 : _c.call(_b, ' ')) === null || _d === void 0 ? void 0 : _d[1];
    if (!token) {
        next();
        return;
    }
    // decode the token
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        const { _id } = decoded;
        const user = yield user_model_1.User.findById(_id);
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
        if (user.status === user_constant_1.USER_STATUS.BLOCKED) {
            next();
            return;
        }
        req.user = user;
        next();
    }
    catch (_e) {
        next();
    }
}));
exports.default = verifyToken;
