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
// Route: /api/v1/users/ (GET)
const getUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/users/:id (DELETE)
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.deleteUserFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/users/:id/make-admin (PUT)
const makeAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.makeAdminIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/users/:id/remove-admin (PUT)
const removeAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.removeAdminFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/users/:id/block (PUT)
const blockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.blockUserIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/users/:id/unblock (PUT)
const unblockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.unblockUserIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/users/me (GET)
const getProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield user_service_1.UserServices.getProfileFromDB(id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/users/me (PUT)
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const result = yield user_service_1.UserServices.updateProfileIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/users/avatar (POST)
const updateAvatar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.updateAvatar(req.user.id, req.file);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/users/contact-us (POST)
const contactUs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.contactUsViaMail(req.body);
    (0, sendResponse_1.default)(res, result);
}));
exports.UserControllers = {
    getUsers,
    deleteUser,
    makeAdmin,
    removeAdmin,
    blockUser,
    unblockUser,
    getProfile,
    updateProfile,
    contactUs,
    updateAvatar,
};
