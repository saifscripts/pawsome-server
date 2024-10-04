import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

// Route: /api/v1/posts/ (POST)
const createPost = catchAsync(async (req, res) => {
    const result = await PostServices.createPostIntoDB(req.user.id, req.body);
    sendResponse(res, result);
});

// Route: /api/v1/posts/ (GET)
const getPosts = catchAsync(async (req, res) => {
    const result = await PostServices.getPostsFromDB(req.user, req.query);
    sendResponse(res, result);
});

// Route: /api/v1/posts/:id (GET)
const getPost = catchAsync(async (req, res) => {
    const result = await PostServices.getPostFromDB(req.params.id, req.user);
    sendResponse(res, result);
});

// Route: /api/v1/posts/:id (PUT)
const updatePost = catchAsync(async (req, res) => {
    const result = await PostServices.updatePostIntoDB(
        req.params.id,
        req.user.id,
        req.body,
    );
    sendResponse(res, result);
});

export const PostControllers = {
    createPost,
    getPosts,
    getPost,
    updatePost,
};
