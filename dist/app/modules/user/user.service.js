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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendMail_1 = require("../../utils/sendMail");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const payment_utils_1 = require("../payment/payment.utils");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
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
const getUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'User retrieved successfully',
        data: Object.assign(Object.assign({}, user.toObject()), { role: undefined, status: undefined, userType: undefined, createdAt: undefined, updatedAt: undefined }),
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
const followUserIntoDB = (userId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId === followingId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You can't follow yourself!");
    }
    const followingUser = yield user_model_1.User.findById(followingId);
    if (!followingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (followingUser.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (followingUser.status === user_constant_1.USER_STATUS.BLOCKED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is blocked!');
    }
    if (followingUser === null || followingUser === void 0 ? void 0 : followingUser.followers.includes(new mongoose_1.default.Types.ObjectId(userId))) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'You already followed the user!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { $addToSet: { following: followingId } }, { new: true, session });
        if (!updatedUser) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to follow the user!');
        }
        const updatedFollowingUser = yield user_model_1.User.findByIdAndUpdate(followingId, { $addToSet: { followers: userId } }, { new: true, session });
        if (!updatedFollowingUser) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to follow the user!');
        }
        // commit transaction and end session
        yield session.commitTransaction();
        yield session.endSession();
        return {
            statusCode: http_status_1.default.OK,
            message: 'User is followed successfully!',
            data: updatedUser,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const unfollowUserFromDB = (userId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (userId === followingId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You can't follow/unfollow yourself!");
    }
    const followingUser = yield user_model_1.User.findById(followingId);
    if (!((_b = (_a = followingUser === null || followingUser === void 0 ? void 0 : followingUser.followers) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, new mongoose_1.default.Types.ObjectId(userId)))) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "You didn't followed the user!");
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { $pull: { following: followingId } }, { new: true, session });
        if (!updatedUser) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to unfollow the user!');
        }
        const updatedFollowingUser = yield user_model_1.User.findByIdAndUpdate(followingId, { $pull: { followers: userId } }, { new: true, session });
        if (!updatedFollowingUser) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to unfollow the user!');
        }
        // commit transaction and end session
        yield session.commitTransaction();
        yield session.endSession();
        return {
            statusCode: http_status_1.default.OK,
            message: 'User is unfollowed successfully!',
            data: updatedUser,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getMeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    return {
        statusCode: http_status_1.default.OK,
        message: 'User profile retrieved successfully',
        data: user,
    };
});
const updateProfileIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return {
        statusCode: http_status_1.default.OK,
        message: 'Profile updated successfully',
        data: updatedUser,
    };
});
const contactUsViaMail = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const emailBody = (0, payment_utils_1.replaceText)(user_constant_1.CONTACT_FORM_MESSAGE, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
    });
    const result = yield (0, sendMail_1.sendMail)({
        from: payload.email,
        to: config_1.default.mail_auth_user,
        subject: `Contact Us Form Submission from ${payload.name}`,
        html: emailBody,
    });
    if (!result.messageId) {
        throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Fail to send email!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Email sent successfully',
        data: null,
    };
});
const updateAvatar = (id, image) => __awaiter(void 0, void 0, void 0, function* () {
    if (!image) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Avatar is required');
    }
    const avatarURL = yield (0, uploadImage_1.default)(image.buffer, id, 'avatar');
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(id, { avatarURL }, {
        new: true,
    });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Avatar uploaded successfully',
        data: updatedUser,
    };
});
exports.UserServices = {
    getUsersFromDB,
    getUserFromDB,
    deleteUserFromDB,
    makeAdminIntoDB,
    removeAdminFromDB,
    blockUserIntoDB,
    unblockUserIntoDB,
    followUserIntoDB,
    unfollowUserFromDB,
    getMeFromDB,
    updateProfileIntoDB,
    contactUsViaMail,
    updateAvatar,
};
