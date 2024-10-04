import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { USER_TYPE } from '../user/user.constant';
import { User } from '../user/user.model';
import IPost from './post.interface';
import { Post } from './post.model';

const createPostIntoDB = async (authorId: string, payload: IPost) => {
    const newPost = await Post.create({ ...payload, author: authorId });

    return {
        statusCode: httpStatus.CREATED,
        message: 'Post created successfully',
        data: newPost,
    };
};

const getPostsFromDB = async (
    decodedUser: JwtPayload,
    query: Record<string, unknown>,
) => {
    const user = await User.findById(decodedUser?.id);
    const isPremiumUser =
        user?.userType === USER_TYPE.PREMIUM &&
        user?.subscriptionEndDate > new Date();

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

const getPostFromDB = async (postId: string, decodedUser: JwtPayload) => {
    const user = await User.findById(decodedUser?.id);
    const isPremiumUser =
        user?.userType === USER_TYPE.PREMIUM &&
        user?.subscriptionEndDate > new Date();

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
    authorId: string, // retrieved from token
    payload: Partial<IPost>,
) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (post.author.toString() !== authorId) {
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
    authorId: string, // retrieved from token
) => {
    const post = await Post.findById(postId);

    if (!post) {
        throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
    }

    if (post.author.toString() !== authorId) {
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

export const PostServices = {
    createPostIntoDB,
    getPostsFromDB,
    getPostFromDB,
    updatePostIntoDB,
    deletePostFromDB,
};
