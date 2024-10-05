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
exports.PostServices = void 0;
/* eslint-disable no-undef */
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const post_model_1 = require("./post.model");
const createPostIntoDB = (authorId, payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    payload.imageUrls = (_a = images === null || images === void 0 ? void 0 : images.map) === null || _a === void 0 ? void 0 : _a.call(images, (image) => image === null || image === void 0 ? void 0 : image.path);
    payload.author = authorId;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // create post
        const newPost = yield post_model_1.Post.create([payload], {
            session,
        });
        if (!newPost.length) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create post!');
        }
        // push post id to author's posts
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(authorId, {
            $push: { posts: newPost[0]._id },
        }, { session });
        if (!updatedUser) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create post!');
        }
        // commit transaction and end session
        yield session.commitTransaction();
        yield session.endSession();
        return {
            statusCode: http_status_1.default.CREATED,
            message: 'Post created successfully',
            data: newPost[0],
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getPostsFromDB = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const isPremiumUser = (user === null || user === void 0 ? void 0 : user.userType) === user_constant_1.USER_TYPE.PREMIUM &&
        ((_b = user === null || user === void 0 ? void 0 : user.subscription) === null || _b === void 0 ? void 0 : _b.endDate) > new Date();
    const postQuery = new QueryBuilder_1.default(post_model_1.Post.find({ isPublished: true }), query)
        // .search(PostSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    let posts = yield postQuery.modelQuery;
    if (!isPremiumUser) {
        posts = posts.map((post) => {
            var _a;
            if (post.isPremium) {
                return {
                    _id: post._id,
                    title: post.title,
                    content: ((_a = post.content) === null || _a === void 0 ? void 0 : _a.substring(0, 100)) + '...',
                    upvotes: post.upvotes,
                    downvotes: post.downvotes,
                    isPremium: true,
                };
            }
            return post;
        });
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Posts retrieved successfully',
        data: posts,
    };
});
const getPostFromDB = (postId, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const isPremiumUser = (user === null || user === void 0 ? void 0 : user.userType) === user_constant_1.USER_TYPE.PREMIUM &&
        ((_c = user === null || user === void 0 ? void 0 : user.subscription) === null || _c === void 0 ? void 0 : _c.endDate) > new Date();
    const post = yield post_model_1.Post.findOne({ _id: postId, isPublished: true });
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    if (!isPremiumUser && (post === null || post === void 0 ? void 0 : post.isPremium)) {
        return {
            statusCode: http_status_1.default.OK,
            message: 'Posts retrieved successfully',
            data: {
                _id: post._id,
                title: post.title,
                content: ((_d = post.content) === null || _d === void 0 ? void 0 : _d.substring(0, 100)) + '...',
                upvotes: post.upvotes,
                downvotes: post.downvotes,
                isPremium: true,
            },
        };
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Posts retrieved successfully',
        data: post,
    };
});
const updatePostIntoDB = (postId, authorId, // retrieved from token
payload) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    if (post.author.toString() !== authorId.toString()) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to update this post!');
    }
    const updatedPost = yield post_model_1.Post.findOneAndUpdate({ _id: postId, author: authorId }, payload, { new: true });
    if (!updatedPost) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Post updated successfully!',
        data: updatedPost,
    };
});
const deletePostFromDB = (postId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    if (post.author.toString() !== authorId.toString()) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to delete this post!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // delete post from db
        const deletedPost = yield post_model_1.Post.findOneAndUpdate({ _id: postId, author: authorId }, { isDeleted: true }, { new: true, session });
        if (!deletedPost) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
        }
        // removed post id from author's posts
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(authorId, {
            $pull: { posts: postId },
        }, { session });
        if (!updatedUser) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete post!');
        }
        // commit transaction and end session
        yield session.commitTransaction();
        yield session.endSession();
        return {
            statusCode: http_status_1.default.OK,
            message: 'Post deleted successfully!',
            data: deletedPost,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const upvotePostFromDB = (postId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    let updateQuery;
    if (post.upvotes.includes(authorId)) {
        // already upvoted
        updateQuery = {
            $pull: { upvotes: authorId },
        };
    }
    else {
        // not upvoted
        updateQuery = {
            $addToSet: { upvotes: authorId },
            $pull: { downvotes: authorId },
        };
    }
    const upvotedPost = yield post_model_1.Post.findByIdAndUpdate(postId, updateQuery, {
        new: true,
    });
    if (!upvotedPost) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Post upvoted successfully!',
        data: upvotedPost,
    };
});
const downvotePostFromDB = (postId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    let updateQuery;
    if (post.downvotes.includes(authorId)) {
        // already downvoted
        updateQuery = {
            $pull: { downvotes: authorId },
        };
    }
    else {
        // not downvoted
        updateQuery = {
            $addToSet: { downvotes: authorId },
            $pull: { upvotes: authorId },
        };
    }
    const downvotedPost = yield post_model_1.Post.findByIdAndUpdate(postId, updateQuery, {
        new: true,
    });
    if (!downvotedPost) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Post downvoted successfully!',
        data: downvotedPost,
    };
});
exports.PostServices = {
    createPostIntoDB,
    getPostsFromDB,
    getPostFromDB,
    updatePostIntoDB,
    deletePostFromDB,
    upvotePostFromDB,
    downvotePostFromDB,
};