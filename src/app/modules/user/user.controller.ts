import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// Route: /api/v1/users/:id (GET)
const getUser = catchAsync(async (req, res) => {
    const result = await UserServices.getUserFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/users/:id/follow (PUT)
const followUser = catchAsync(async (req, res) => {
    const result = await UserServices.followUserIntoDB(
        req.user._id,
        req.params.id,
    );
    sendResponse(res, result);
});

// Route: /api/users/:id/unfollow (PUT)
const unfollowUser = catchAsync(async (req, res) => {
    const result = await UserServices.unfollowUserFromDB(
        req.user._id,
        req.params.id,
    );
    sendResponse(res, result);
});

// Route: /api/v1/users/me (GET)
const getMe = catchAsync(async (req, res) => {
    const result = await UserServices.getMeFromDB(req.user._id);
    sendResponse(res, result);
});

// Route: /api/users/me (PUT)
const updateProfile = catchAsync(async (req, res) => {
    const result = await UserServices.updateProfileIntoDB(
        req.user._id,
        req.body,
    );
    sendResponse(res, result);
});

// Route: /api/v1/users/avatar (POST)
const updateAvatar = catchAsync(async (req, res) => {
    const result = await UserServices.updateAvatar(
        req.user._id,
        req?.file?.path,
    );
    sendResponse(res, result);
});

// Route: /api/v1/users/contact-us (POST)
const contactUs = catchAsync(async (req, res) => {
    const result = await UserServices.contactUsViaMail(req.body);
    sendResponse(res, result);
});

export const UserControllers = {
    getUser,
    followUser,
    unfollowUser,
    getMe,
    updateProfile,
    contactUs,
    updateAvatar,
};
