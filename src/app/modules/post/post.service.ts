import httpStatus from 'http-status';
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

const getPostsFromDB = async () => {
    const posts = await Post.find({});

    return {
        statusCode: httpStatus.OK,
        message: 'Posts retrieved successfully',
        data: posts,
    };
};

export const PostServices = {
    createPostIntoDB,
    getPostsFromDB,
};
