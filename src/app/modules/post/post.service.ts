/* eslint-disable no-undef */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { USER_TYPE } from '../user/user.constant';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { PostSearchableFields } from './post.constant';
import IPost from './post.interface';
import { Post } from './post.model';

const createPostIntoDB = async (
    authorId: mongoose.Types.ObjectId,
    payload: IPost,
    featuredImage: Express.Multer.File,
) => {
    payload.featuredImage = featuredImage?.path;
    payload.author = authorId;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // create post
        const newPost = await Post.create([payload], {
            session,
        });

        if (!newPost.length) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to create post!',
            );
        }

        // push post id to author's posts
        const updatedUser = await User.findByIdAndUpdate(
            authorId,
            {
                $push: { posts: newPost[0]._id },
            },
            { session },
        );

        if (!updatedUser) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to create post!',
            );
        }

        // commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        return {
            statusCode: httpStatus.CREATED,
            message: 'Post created successfully',
            data: newPost[0],
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getPostsFromDB = async (user: IUser, query: Record<string, unknown>) => {
    const isPremiumUser =
        user?.userType === USER_TYPE.PREMIUM &&
        user?.subscription?.endDate > new Date();

    const postQuery = new QueryBuilder(
        Post.find({ isPublished: true }).populate('author'),
        query,
    )
        .search(PostSearchableFields)
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
                    summary: post.summary,
                    featuredImage: post.featuredImage,
                    upvotes: post.upvotes,
                    downvotes: post.downvotes,
                    author: post.author,
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

const getTagsFromDB = async (query: Record<string, unknown>) => {
    const limit = parseInt(query.limit as string) || 10;

    const tags = await Post.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
    ]);

    return {
        statusCode: httpStatus.OK,
        message: 'Tags retrieved successfully',
        data: tags,
    };
};

const getPostFromDB = async (postId: string, user: IUser) => {
    const isPremiumUser =
        user?.userType === USER_TYPE.PREMIUM &&
        user?.subscription?.endDate > new Date();

    const post = await Post.findOne({
        _id: postId,
        isPublished: true,
    }).populate('author');

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (!isPremiumUser && post?.isPremium) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access!');

        // return {
        //     statusCode: httpStatus.OK,
        //     message: 'Posts retrieved successfully',
        //     data: {
        //         _id: post._id,
        //         title: post.title,
        //         summary: post.summary,
        //         upvotes: post.upvotes,
        //         downvotes: post.downvotes,
        //         author: post.author,
        //         isPremium: true,
        //     },
        // };
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
    featuredImage: Express.Multer.File,
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

    if (!featuredImage?.path && payload?.featuredImage === undefined) {
        // no image to update (this will preserve old image)
        payload.featuredImage = undefined;
    } else {
        // received new image (this will replace old image)
        payload.featuredImage = payload.featuredImage || featuredImage?.path;
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

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // delete post from db
        const deletedPost = await Post.findOneAndUpdate(
            { _id: postId, author: authorId },
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedPost) {
            throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
        }

        // removed post id from author's posts
        const updatedUser = await User.findByIdAndUpdate(
            authorId,
            {
                $pull: { posts: postId },
            },
            { session },
        );

        if (!updatedUser) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Failed to delete post!',
            );
        }

        // commit transaction and end session
        await session.commitTransaction();
        await session.endSession();

        return {
            statusCode: httpStatus.OK,
            message: 'Post deleted successfully!',
            data: deletedPost,
        };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
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
    getTagsFromDB,
    getPostFromDB,
    updatePostIntoDB,
    deletePostFromDB,
    upvotePostFromDB,
    downvotePostFromDB,
};
