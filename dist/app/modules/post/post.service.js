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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const post_constant_1 = require("./post.constant");
const post_model_1 = require("./post.model");
const createPostIntoDB = (authorId, payload, featuredImage) => __awaiter(void 0, void 0, void 0, function* () {
    payload.featuredImage = featuredImage === null || featuredImage === void 0 ? void 0 : featuredImage.path;
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
    var _a;
    const { feed } = query, params = __rest(query, ["feed"]);
    const matchQuery = { isPublished: true };
    if (feed === 'following') {
        matchQuery.author = { $in: user.following };
    }
    const postQuery = new QueryBuilder_1.default(post_model_1.Post.find(matchQuery).populate('author'), params)
        .search(post_constant_1.PostSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    let posts = yield postQuery.modelQuery;
    const isPremiumUser = (user === null || user === void 0 ? void 0 : user.userType) === user_constant_1.USER_TYPE.PREMIUM &&
        ((_a = user === null || user === void 0 ? void 0 : user.subscription) === null || _a === void 0 ? void 0 : _a.endDate) > new Date();
    if (!isPremiumUser) {
        posts = posts.map((post) => {
            if (post.isPremium) {
                return {
                    _id: post._id,
                    title: post.title,
                    summary: post.summary,
                    featuredImage: post.featuredImage,
                    category: post.category,
                    tags: post.tags,
                    upvotes: post.upvotes,
                    downvotes: post.downvotes,
                    totalVotes: post.totalVotes,
                    comments: post.comments,
                    totalComments: post.totalComments,
                    author: post.author,
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
const getMyPostsFromDB = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_model_1.Post.find({ author: authorId });
    return {
        statusCode: http_status_1.default.OK,
        message: 'Posts retrieved successfully',
        data: posts,
    };
});
const getTagsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = parseInt(query.limit) || 10;
    const tags = yield post_model_1.Post.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
    ]);
    return {
        statusCode: http_status_1.default.OK,
        message: 'Tags retrieved successfully',
        data: tags,
    };
});
const getPostFromDB = (postId, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const isPremiumUser = (user === null || user === void 0 ? void 0 : user.userType) === user_constant_1.USER_TYPE.PREMIUM &&
        ((_b = user === null || user === void 0 ? void 0 : user.subscription) === null || _b === void 0 ? void 0 : _b.endDate) > new Date();
    const post = yield post_model_1.Post.findOne({
        _id: postId,
        isPublished: true,
    }).populate('author');
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
                summary: post.summary,
                featuredImage: post.featuredImage,
                category: post.category,
                tags: post.tags,
                upvotes: post.upvotes,
                downvotes: post.downvotes,
                totalVotes: post.totalVotes,
                comments: post.comments,
                totalComments: post.totalComments,
                author: post.author,
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
payload, featuredImage) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    if (post.author.toString() !== authorId.toString()) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to update this post!');
    }
    if (!(featuredImage === null || featuredImage === void 0 ? void 0 : featuredImage.path) && (payload === null || payload === void 0 ? void 0 : payload.featuredImage) === undefined) {
        // no image to update (this will preserve old image)
        payload.featuredImage = undefined;
    }
    else {
        // received new image (this will replace old image)
        payload.featuredImage = payload.featuredImage || (featuredImage === null || featuredImage === void 0 ? void 0 : featuredImage.path);
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
    const result = yield upvotedPost.save(); // updates totalVotes using pre middleware
    return {
        statusCode: http_status_1.default.OK,
        message: 'Post upvoted successfully!',
        data: result,
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
    const result = yield downvotedPost.save(); // updates totalVotes using pre middleware
    return {
        statusCode: http_status_1.default.OK,
        message: 'Post downvoted successfully!',
        data: result,
    };
});
exports.PostServices = {
    createPostIntoDB,
    getPostsFromDB,
    getMyPostsFromDB,
    getTagsFromDB,
    getPostFromDB,
    updatePostIntoDB,
    deletePostFromDB,
    upvotePostFromDB,
    downvotePostFromDB,
};
