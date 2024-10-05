import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

// Route: /api/v1/admin/posts/ (GET)
const getPosts = catchAsync(async (req, res) => {
    const result = await AdminServices.getPostsFromDB(req.query);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/ (GET)
const getUsers = catchAsync(async (req, res) => {
    const result = await AdminServices.getUsersFromDB(req.query);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/delete (DELETE)
const deleteUser = catchAsync(async (req, res) => {
    const result = await AdminServices.deleteUserFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/make-admin (PUT)
const makeAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.makeAdminIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/remove-admin (PUT)
const removeAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.removeAdminFromDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/block (PUT)
const blockUser = catchAsync(async (req, res) => {
    const result = await AdminServices.blockUserIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/users/:id/unblock (PUT)
const unblockUser = catchAsync(async (req, res) => {
    const result = await AdminServices.unblockUserIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/posts/:id/publish (PUT)
const publishPost = catchAsync(async (req, res) => {
    const result = await AdminServices.publishPostIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/posts/:id/unpublish (PUT)
const unpublishPost = catchAsync(async (req, res) => {
    const result = await AdminServices.unpublishPostIntoDB(req.params.id);
    sendResponse(res, result);
});

// Route: /api/v1/admin/payments/ (GET)
const getPayments = catchAsync(async (req, res) => {
    const result = await AdminServices.getPaymentsFromDB(req.query);
    sendResponse(res, result);
});

// Route: /api/v1/admin/payments/:id (DELETE)
const deletePayment = catchAsync(async (req, res) => {
    const result = await AdminServices.deletePaymentFromDB(req.params.id);
    sendResponse(res, result);
});

export const AdminControllers = {
    getPosts,
    getUsers,
    deleteUser,
    makeAdmin,
    removeAdmin,
    blockUser,
    unblockUser,
    publishPost,
    unpublishPost,
    getPayments,
    deletePayment,
};
