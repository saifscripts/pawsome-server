import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';

// Route: /api/v1/comments/ (POST)
const createComment = catchAsync(async (req, res) => {
    const result = await CommentServices.createCommentIntoDB(
        req.user._id,
        req.body,
    );
    sendResponse(res, result);
});

// Route: /api/v1/comments/:id (PUT)
const updateComment = catchAsync(async (req, res) => {
    const result = await CommentServices.updateCommentIntoDB(
        req.params.id,
        req.user._id,
        req.body,
    );
    sendResponse(res, result);
});

// Route: /api/v1/comments/:id (DELETE)
const deleteComment = catchAsync(async (req, res) => {
    const result = await CommentServices.deleteCommentFromDB(
        req.params.id,
        req.user._id,
    );
    sendResponse(res, result);
});

// Route: /api/v1/comments/post/:postId (GET)
const getCommentsByPostId = catchAsync(async (req, res) => {
    const result = await CommentServices.getCommentsByPostIdFromDB(
        req.params.postId,
    );
    sendResponse(res, result);
});

export const CommentControllers = {
    createComment,
    updateComment,
    deleteComment,
    getCommentsByPostId,
};
