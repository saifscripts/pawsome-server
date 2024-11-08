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
exports.CommentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const post_model_1 = require("../post/post.model");
const comment_model_1 = require("./comment.model");
const createCommentIntoDB = (authorId, // retrieved from token
payload) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.Post.findById(payload.postId);
    if (!post) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // create comment
        const newComment = yield comment_model_1.Comment.create([
            Object.assign(Object.assign({}, payload), { author: authorId }),
        ], { session });
        if (!newComment.length) {
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create comment!');
        }
        // push comment id to post's comments
        const updatedPost = yield post_model_1.Post.findOneAndUpdate({ _id: payload.postId }, { $push: { comments: newComment[0]._id } }, { new: true, session });
        if (!updatedPost) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
        }
        yield updatedPost.save(); // updates totalVotes using pre middleware
        // commit transaction and end session
        yield session.commitTransaction();
        yield session.endSession();
        return {
            statusCode: http_status_1.default.CREATED,
            message: 'Comment created successfully',
            data: yield newComment[0].populate({
                path: 'author',
                select: 'name email avatarURL',
            }),
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const updateCommentIntoDB = (commentId, authorId, // retrieved from token
payload) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(commentId);
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found!');
    }
    if (comment.author.toString() !== authorId.toString()) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to update this comment!');
    }
    const updatedComment = yield comment_model_1.Comment.findOneAndUpdate({ _id: commentId, author: authorId }, payload, { new: true }).populate({
        path: 'author',
        select: 'name email avatarURL',
    });
    if (!updatedComment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found!');
    }
    return {
        statusCode: http_status_1.default.OK,
        message: 'Comment updated successfully!',
        data: updatedComment,
    };
});
const deleteCommentFromDB = (commentId, authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.findById(commentId);
    if (!comment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found!');
    }
    if (comment.author.toString() !== authorId.toString()) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to delete this comment!');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // delete comment from db
        const deletedComment = yield comment_model_1.Comment.findOneAndUpdate({ _id: commentId, author: authorId }, { isDeleted: true }, { new: true, session });
        if (!deletedComment) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Comment not found!');
        }
        // remove comment id to post's comments
        const updatedPost = yield post_model_1.Post.findOneAndUpdate({ _id: deletedComment.postId }, { $pull: { comments: deletedComment._id } }, { new: true, session });
        if (!updatedPost) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Post not found!');
        }
        yield updatedPost.save(); // updates totalVotes using pre middleware
        // commit transaction and end session
        yield session.commitTransaction();
        yield session.endSession();
        return {
            statusCode: http_status_1.default.OK,
            message: 'Comment deleted successfully!',
            data: deletedComment,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
const getCommentsByPostIdFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield comment_model_1.Comment.find({ postId })
        .populate('author')
        .sort('createdAt');
    return {
        statusCode: http_status_1.default.OK,
        message: 'Comments fetched successfully!',
        data: comments,
    };
});
exports.CommentServices = {
    createCommentIntoDB,
    updateCommentIntoDB,
    deleteCommentFromDB,
    getCommentsByPostIdFromDB,
};
