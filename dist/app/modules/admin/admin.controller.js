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
exports.AdminControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
// Route: /api/v1/admin/posts/ (GET)
const getPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getPostsFromDB(req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/ (GET)
const getUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getUsersFromDB(req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/delete (DELETE)
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.deleteUserFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/make-admin (PUT)
const makeAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.makeAdminIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/remove-admin (PUT)
const removeAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.removeAdminFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/block (PUT)
const blockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.blockUserIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/users/:id/unblock (PUT)
const unblockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.unblockUserIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/posts/:id/publish (PUT)
const publishPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.publishPostIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/posts/:id/unpublish (PUT)
const unpublishPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.unpublishPostIntoDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/payments/ (GET)
const getPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.getPaymentsFromDB(req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/admin/payments/:id (DELETE)
const deletePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.deletePaymentFromDB(req.params.id);
    (0, sendResponse_1.default)(res, result);
}));
exports.AdminControllers = {
    getPosts,
    getUsers,
    deleteUser,
    makeAdmin,
    removeAdmin,
    blockUser,
    unblockUser,
    publishPost,
    unpublishPost,
    getPayments,
    deletePayment,
};
