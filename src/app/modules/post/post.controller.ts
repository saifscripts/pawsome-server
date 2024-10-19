/* eslint-disable no-undef */
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

// Route: /api/v1/posts/ (POST)
const createPost = catchAsync(async (req, res) => {
    const result = await PostServices.createPostIntoDB(
        req.user._id,
        req.body,
        req.file as Express.Multer.File,
    );
    sendResponse(res, result);
});

// Route: /api/v1/posts/ (GET)
const getPosts = catchAsync(async (req, res) => {
    const result = await PostServices.getPostsFromDB(req.user, req.query);
    sendResponse(res, result);
});

// Route: /api/v1/posts/tags (GET)
const getTags = catchAsync(async (req, res) => {
    const result = await PostServices.getTagsFromDB(req.query);
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
        req.user._id,
        req.body,
        req.file as Express.Multer.File,
    );
    sendResponse(res, result);
});

// Route: /api/v1/posts/:id (DELETE)
const deletePost = catchAsync(async (req, res) => {
    const result = await PostServices.deletePostFromDB(
        req.params.id,
        req.user._id,
    );
    sendResponse(res, result);
});

// Route: /api/v1/posts/:id/upvote (PUT)
const upvotePost = catchAsync(async (req, res) => {
    const result = await PostServices.upvotePostFromDB(
        req.params.id,
        req.user._id,
    );
    sendResponse(res, result);
});

// Route: /api/v1/posts/:id/downvote (PUT)
const downvotePost = catchAsync(async (req, res) => {
    const result = await PostServices.downvotePostFromDB(
        req.params.id,
        req.user._id,
    );
    sendResponse(res, result);
});

export const PostControllers = {
    createPost,
    getPosts,
    getTags,
    getPost,
    updatePost,
    deletePost,
    upvotePost,
    downvotePost,
};
