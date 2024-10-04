import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Post } from '../post/post.model';
import { IComment } from './comment.interface';
import { Comment } from './comment.model';

const createCommentIntoDB = async (authorId: string, payload: IComment) => {
    const post = await Post.findById(payload.postId);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    const newComment = await Comment.create({ ...payload, author: authorId });

    return {
        statusCode: httpStatus.CREATED,
        message: 'Comment created successfully',
        data: newComment,
    };
};

const updateCommentIntoDB = async (
    commentId: string,
    authorId: string, // retrieved from token
    payload: Partial<IComment>,
) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
    }

    if (comment.author.toString() !== authorId) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized to update this comment!',
        );
    }

    const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, author: authorId },
        payload,
        { new: true },
    );

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
    authorId: string, // retrieved from token
) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
    }

    if (comment.author.toString() !== authorId) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized to delete this comment!',
        );
    }

    const deletedComment = await Comment.findOneAndUpdate(
        { _id: commentId, author: authorId },
        { isDeleted: true },
        { new: true },
    );

    if (!deletedComment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Comment deleted successfully!',
        data: deletedComment,
    };
};

export const CommentServices = {
    createCommentIntoDB,
    updateCommentIntoDB,
    deleteCommentFromDB,
};
