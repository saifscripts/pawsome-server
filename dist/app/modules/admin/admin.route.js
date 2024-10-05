"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.route('/users/').get((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getUsers);
router
    .route('/users/:id/delete')
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.deleteUser);
router
    .route('/users/:id/make-admin')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.makeAdmin);
router
    .route('/users/:id/remove-admin')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.removeAdmin);
router
    .route('/users/:id/block')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.blockUser);
router
    .route('/users/:id/unblock')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.unblockUser);
router.route('/posts').get((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getPosts);
router
    .route('/posts/:id/publish')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.publishPost);
router
    .route('/posts/:id/unpublish')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.unpublishPost);
router
    .route('/payments/')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.getPayments);
router
    .route('/payments/:id')
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.AdminControllers.deletePayment);
exports.AdminRoutes = router;
