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
exports.UserControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
// Route: /api/v1/users/:id (GET)
const getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getUserFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/users/:id/follow (PUT)
const followUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.followUserIntoDB(req.user._id, req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/users/:id/unfollow (PUT)
const unfollowUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.unfollowUserFromDB(req.user._id, req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/users/me (GET)
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getMeFromDB(req.user._id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/users/me (PUT)
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.updateProfileIntoDB(req.user._id, req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/users/avatar (POST)
const updateAvatar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_service_1.UserServices.updateAvatar(req.user._id, (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/users/contact-us (POST)
const contactUs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.contactUsViaMail(req.body);
    (0, sendResponse_1.default)(res, result);
}));
exports.UserControllers = {
    getUser,
    followUser,
    unfollowUser,
    getMe,
    updateProfile,
    contactUs,
    updateAvatar,
};
