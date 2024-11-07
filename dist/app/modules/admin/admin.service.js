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
exports.AdminServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const payment_model_1 = require("../payment/payment.model");
const post_model_1 = require("../post/post.model");
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const getPostsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const postQuery = new QueryBuilder_1.default(post_model_1.Post.find(), query)
        // .search(PostSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const posts = yield postQuery.modelQuery;
    const meta = yield postQuery.countTotal();
    return {
        statusCode: http_status_1.default.OK,
        message: 'Posts retrieved successfully',
        data: posts,
        meta,
    };
});
const getUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        // .search(UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const users = yield userQuery.modelQuery;
    const meta = yield userQuery.countTotal();
    return {
        statusCode: http_status_1.default.OK,
        message: 'Users retrieved successfully',
        data: users,
        meta,
    };
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // TODO:check other conditions for not deleting
    // delete the user
    const deletedUser = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedUser) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete user!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'User deleted successfully',
        data: deletedUser,
    };
});
const makeAdminIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    // check if the user exists
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
    if (user.role === user_constant_1.USER_ROLE.ADMIN) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already an admin!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { role: user_constant_1.USER_ROLE.ADMIN }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User role updated successfully!',
        data: result,
    };
});
const removeAdminFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.role !== user_constant_1.USER_ROLE.ADMIN) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is not an admin!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { role: user_constant_1.USER_ROLE.USER }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User role updated successfully!',
        data: result,
    };
});
const blockUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.status === user_constant_1.USER_STATUS.BLOCKED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already blocked!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        status: user_constant_1.USER_STATUS.BLOCKED,
    }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User is blocked successfully!',
        data: result,
    };
});
const unblockUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.status === user_constant_1.USER_STATUS.ACTIVE) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already unblocked!');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        status: user_constant_1.USER_STATUS.ACTIVE,
    }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'User is unblocked successfully!',
        data: result,
    };
});
const publishPostIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(id);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    if (post.isPublished) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Post is already published!');
    }
    const result = yield post_model_1.Post.findByIdAndUpdate(id, {
        isPublished: true,
    }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'Post is published successfully!',
        data: result,
    };
});
const unpublishPostIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(id);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    if (post.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    if (!post.isPublished) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Post is already unpublished!');
    }
    const result = yield post_model_1.Post.findByIdAndUpdate(id, {
        isPublished: false,
    }, { new: true });
    return {
        statusCode: http_status_1.default.OK,
        message: 'Post is unpublished successfully!',
        data: result,
    };
});
const getPaymentsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentQuery = new QueryBuilder_1.default(payment_model_1.Payment.find().populate('user'), query)
        // .search(PaymentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const payments = yield paymentQuery.modelQuery;
    const meta = yield paymentQuery.countTotal();
    return {
        statusCode: http_status_1.default.OK,
        message: 'Payments retrieved successfully',
        data: payments,
        meta,
    };
});
const deletePaymentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(id);
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment not found!');
    }
    // delete the user
    const deletedPayment = yield payment_model_1.Payment.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedPayment) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete payment!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Payment deleted successfully',
        data: deletedPayment,
    };
});
exports.AdminServices = {
    getPostsFromDB,
    getUsersFromDB,
    deleteUserFromDB,
    makeAdminIntoDB,
    removeAdminFromDB,
    blockUserIntoDB,
    unblockUserIntoDB,
    publishPostIntoDB,
    unpublishPostIntoDB,
    getPaymentsFromDB,
    deletePaymentFromDB,
};
