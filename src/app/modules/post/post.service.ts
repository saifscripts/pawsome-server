import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builders/QueryBuilder';
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
        user &&
        user?.userType === USER_TYPE.PREMIUM &&
        user?.subscriptionEndDate > new Date();

    const postQuery = new QueryBuilder(Post.find(), query)
        // .search(UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    let posts: Partial<IPost>[] = await postQuery.modelQuery;

    if (!isPremiumUser) {
        posts = posts.map((post) => {
            if (post.isPremium) {
                return {
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

export const PostServices = {
    createPostIntoDB,
    getPostsFromDB,
};
