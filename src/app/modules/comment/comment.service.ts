import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Post } from '../post/post.model';
import { IComment } from './comment.interface';
import { Comment } from './comment.model';

const createCommentIntoDB = async (
    authorId: mongoose.Types.ObjectId, // retrieved from token
    payload: IComment,
) => {
    const post = await Post.findById(payload.postId);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // create comment
        const newComment = await Comment.create(
            [
                {
                    ...payload,
                    author: authorId,
                },
            ],
            { session },
        );

        if (!newComment.length) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to create comment!',
            );
        }

        // push comment id to post's comments
        const updatedPost = await Post.findOneAndUpdate(
            { _id: payload.postId },
            { $push: { comments: newComment[0]._id } },
            { new: true, session },
        );

        if (!updatedPost) {
            throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
        }

        await updatedPost.save(); // updates totalVotes using pre middleware

        // commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        return {
            statusCode: httpStatus.CREATED,
            message: 'Comment created successfully',
            data: await newComment[0].populate({
                path: 'author',
                select: 'name email avatarURL',
            }),
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const updateCommentIntoDB = async (
    commentId: string,
    authorId: mongoose.Types.ObjectId, // retrieved from token
    payload: Partial<IComment>,
) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
    }

    if (comment.author.toString() !== authorId.toString()) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized to update this comment!',
        );
    }

    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, author: authorId },
        payload,
        { new: true },
    ).populate({
        path: 'author',
        select: 'name email avatarURL',
    });

    if (!updatedComment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Comment updated successfully!',
        data: updatedComment,
    };
};

const deleteCommentFromDB = async (
    commentId: string,
    authorId: mongoose.Types.ObjectId, // retrieved from token
) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
    }

    if (comment.author.toString() !== authorId.toString()) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized to delete this comment!',
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // delete comment from db
        const deletedComment = await Comment.findOneAndUpdate(
            { _id: commentId, author: authorId },
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedComment) {
            throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
        }

        // remove comment id to post's comments
        const updatedPost = await Post.findOneAndUpdate(
            { _id: deletedComment.postId },
            { $pull: { comments: deletedComment._id } },
            { new: true, session },
        );

        if (!updatedPost) {
            throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
        }

        await updatedPost.save(); // updates totalVotes using pre middleware

        // commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        return {
            statusCode: httpStatus.OK,
            message: 'Comment deleted successfully!',
            data: deletedComment,
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getCommentsByPostIdFromDB = async (postId: string) => {
    const comments = await Comment.find({ postId })
        .populate('author')
        .sort('createdAt');

    return {
        statusCode: httpStatus.OK,
        message: 'Comments fetched successfully!',
        data: comments,
    };
};

export const CommentServices = {
    createCommentIntoDB,
    updateCommentIntoDB,
    deleteCommentFromDB,
    getCommentsByPostIdFromDB,
};
