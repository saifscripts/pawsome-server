"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostControllers = void 0;
/* eslint-disable no-undef */
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const post_service_1 = require("./post.service");
// Route: /api/v1/posts/ (POST)
const createPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.createPostIntoDB(req.user._id, req.body, req.file);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/posts/ (GET)
const getPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.getPostsFromDB(req.user, req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/posts/my-posts (GET)
const getMyPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.getMyPostsFromDB(req.user._id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/posts/tags (GET)
const getTags = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.getTagsFromDB(req.query);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/posts/:id (GET)
const getPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.getPostFromDB(req.params.id, req.user);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/posts/:id (PUT)
const updatePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.updatePostIntoDB(req.params.id, req.user._id, req.body, req.file);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/posts/:id (DELETE)
const deletePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.deletePostFromDB(req.params.id, req.user._id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/posts/:id/upvote (PUT)
const upvotePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.upvotePostFromDB(req.params.id, req.user._id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/posts/:id/downvote (PUT)
const downvotePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_service_1.PostServices.downvotePostFromDB(req.params.id, req.user._id);
    (0, sendResponse_1.default)(res, result);
}));
exports.PostControllers = {
    createPost,
    getPosts,
    getMyPosts,
    getTags,
    getPost,
    updatePost,
    deletePost,
    upvotePost,
    downvotePost,
};
