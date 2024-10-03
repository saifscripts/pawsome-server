import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// Route: /api/v1/users/ (GET)
const getUsers = catchAsync(async (req, res) => {
    const result = await UserServices.getUsersFromDB(req.query);
    sendResponse(res, result);
});

// Route: /api/v1/users/:id (GET)
const getUser = catchAsync(async (req, res) => {
    const result = await UserServices.getUserFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/users/:id (DELETE)
const deleteUser = catchAsync(async (req, res) => {
    const result = await UserServices.deleteUserFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/users/:id/make-admin (PUT)
const makeAdmin = catchAsync(async (req, res) => {
    const result = await UserServices.makeAdminIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/users/:id/remove-admin (PUT)
const removeAdmin = catchAsync(async (req, res) => {
    const result = await UserServices.removeAdminFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/users/:id/block (PUT)
const blockUser = catchAsync(async (req, res) => {
    const result = await UserServices.blockUserIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/users/:id/unblock (PUT)
const unblockUser = catchAsync(async (req, res) => {
    const result = await UserServices.unblockUserIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/users/:id/follow (PUT)
const followUser = catchAsync(async (req, res) => {
    const result = await UserServices.followUserIntoDB(
        req.user.id,
        req.params.id,
    );
    sendResponse(res, result);
});

// Route: /api/users/:id/unfollow (PUT)
const unfollowUser = catchAsync(async (req, res) => {
    const result = await UserServices.unfollowUserFromDB(
        req.user.id,
        req.params.id,
    );
    sendResponse(res, result);
});

// Route: /api/v1/users/me (GET)
const getProfile = catchAsync(async (req, res) => {
    const result = await UserServices.getProfileFromDB(req.user.id);
    sendResponse(res, result);
});

// Route: /api/users/me (PUT)
const updateProfile = catchAsync(async (req, res) => {
    const { id } = req.user;
    const result = await UserServices.updateProfileIntoDB(id, req.body);
    sendResponse(res, result);
});

// Route: /api/v1/users/avatar (POST)
const updateAvatar = catchAsync(async (req, res) => {
    const result = await UserServices.updateAvatar(req.user.id, req.file!);
    sendResponse(res, result);
});

// Route: /api/v1/users/contact-us (POST)
const contactUs = catchAsync(async (req, res) => {
    const result = await UserServices.contactUsViaMail(req.body);
    sendResponse(res, result);
});

export const UserControllers = {
    getUsers,
    getUser,
    deleteUser,
    makeAdmin,
    removeAdmin,
    blockUser,
    unblockUser,
    followUser,
    unfollowUser,
    getProfile,
    updateProfile,
    contactUs,
    updateAvatar,
};
