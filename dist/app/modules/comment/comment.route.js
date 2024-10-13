"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const comment_controller_1 = require("./comment.controller");
const comment_validation_1 = require("./comment.validation");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(comment_validation_1.CommentValidations.createCommentValidationSchema), comment_controller_1.CommentControllers.createComment);
router
    .route('/:id')
    .put((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(comment_validation_1.CommentValidations.updateCommentValidationSchema), comment_controller_1.CommentControllers.updateComment)
    .delete((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), comment_controller_1.CommentControllers.deleteComment);
router.route('/post/:postId').get(comment_controller_1.CommentControllers.getCommentsByPostId);
exports.CommentRoutes = router;
