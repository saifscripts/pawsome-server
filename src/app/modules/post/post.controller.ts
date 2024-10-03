import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

// Route: /api/v1/posts/ (POST)
const createPost = catchAsync(async (req, res) => {
    const result = await PostServices.createPostIntoDB(req.user.id, req.body);
    sendResponse(res, result);
});

export const PostControllers = {
    createPost,
};
