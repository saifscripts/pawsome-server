import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { USER_TYPE } from '../user/user.constant';
import { IUser } from '../user/user.interface';
import IPost from './post.interface';
import { Post } from './post.model';

const createPostIntoDB = async (
    authorId: mongoose.Types.ObjectId,
    payload: IPost,
) => {
    const newPost = await Post.create({ ...payload, author: authorId });

    return {
        statusCode: httpStatus.CREATED,
        message: 'Post created successfully',
        data: newPost,
    };
};

const getPostsFromDB = async (user: IUser, query: Record<string, unknown>) => {
    const isPremiumUser =
        user?.userType === USER_TYPE.PREMIUM &&
        user?.subscription?.endDate > new Date();

    const postQuery = new QueryBuilder(Post.find({ isPublished: true }), query)
        // .search(PostSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    let posts: Partial<IPost>[] = await postQuery.modelQuery;

    if (!isPremiumUser) {
        posts = posts.map((post) => {
            if (post.isPremium) {
                return {
                    _id: post._id,
                    title: post.title,
                    content: post.content?.substring(0, 100) + '...',
                    upvotes: post.upvotes,
                    downvotes: post.downvotes,
                    isPremium: true,
                };
            }
            return post;
        });
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Posts retrieved successfully',
        data: posts,
    };
};

const getPostFromDB = async (postId: string, user: IUser) => {
    const isPremiumUser =
        user?.userType === USER_TYPE.PREMIUM &&
        user?.subscription?.endDate > new Date();

    const post = await Post.findOne({ _id: postId, isPublished: true });

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (!isPremiumUser && post?.isPremium) {
        return {
            statusCode: httpStatus.OK,
            message: 'Posts retrieved successfully',
            data: {
                _id: post._id,
                title: post.title,
                content: post.content?.substring(0, 100) + '...',
                upvotes: post.upvotes,
                downvotes: post.downvotes,
                isPremium: true,
            },
        };
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Posts retrieved successfully',
        data: post,
    };
};

const updatePostIntoDB = async (
    postId: string,
    authorId: mongoose.Types.ObjectId, // retrieved from token
    payload: Partial<IPost>,
) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (post.author.toString() !== authorId.toString()) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized to update this post!',
        );
    }

    const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, author: authorId },
        payload,
        { new: true },
    );

    if (!updatedPost) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Post updated successfully!',
        data: updatedPost,
    };
};

const deletePostFromDB = async (
    postId: string,
    authorId: mongoose.Types.ObjectId, // retrieved from token
) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (post.author.toString() !== authorId.toString()) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized to delete this post!',
        );
    }

    const deletedPost = await Post.findOneAndUpdate(
        { _id: postId, author: authorId },
        { isDeleted: true },
        { new: true },
    );

    if (!deletedPost) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Post deleted successfully!',
        data: deletedPost,
    };
};

const upvotePostFromDB = async (
    postId: string,
    authorId: mongoose.Types.ObjectId, // retrieved from token
) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    let updateQuery: mongoose.UpdateQuery<IPost>;

    if (post.upvotes.includes(authorId)) {
        // already upvoted
        updateQuery = {
            $pull: { upvotes: authorId },
        };
    } else {
        // not upvoted
        updateQuery = {
            $addToSet: { upvotes: authorId },
            $pull: { downvotes: authorId },
        };
    }

    const upvotedPost = await Post.findByIdAndUpdate(postId, updateQuery, {
        new: true,
    });

    if (!upvotedPost) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Post upvoted successfully!',
        data: upvotedPost,
    };
};

const downvotePostFromDB = async (
    postId: string,
    authorId: mongoose.Types.ObjectId, // retrieved from token
) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    let updateQuery: mongoose.UpdateQuery<IPost>;

    if (post.downvotes.includes(authorId)) {
        // already downvoted
        updateQuery = {
            $pull: { downvotes: authorId },
        };
    } else {
        // not downvoted
        updateQuery = {
            $addToSet: { downvotes: authorId },
            $pull: { upvotes: authorId },
        };
    }

    const downvotedPost = await Post.findByIdAndUpdate(postId, updateQuery, {
        new: true,
    });

    if (!downvotedPost) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    return {
        statusCode: httpStatus.OK,
        message: 'Post downvoted successfully!',
        data: downvotedPost,
    };
};

export const PostServices = {
    createPostIntoDB,
    getPostsFromDB,
    getPostFromDB,
    updatePostIntoDB,
    deletePostFromDB,
    upvotePostFromDB,
    downvotePostFromDB,
};
