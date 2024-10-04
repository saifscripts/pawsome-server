"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const user_constant_1 = require("../user/user.constant");
const post_controller_1 = require("./post.controller");
const post_validation_1 = require("./post.validation");
const router = express_1.default.Router();
router
    .route('/')
    .get(verifyToken_1.default, post_controller_1.PostControllers.getPosts)
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(post_validation_1.PostValidations.createPostValidationSchema), post_controller_1.PostControllers.createPost);
exports.PostRoutes = router;
