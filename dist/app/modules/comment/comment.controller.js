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
exports.CommentControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const comment_service_1 = require("./comment.service");
// Route: /api/v1/comments/ (POST)
const createComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.CommentServices.createCommentIntoDB(req.user._id, req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/comments/:id (PUT)
const updateComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.CommentServices.updateCommentIntoDB(req.params.id, req.user._id, req.body);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/comments/:id (DELETE)
const deleteComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.CommentServices.deleteCommentFromDB(req.params.id, req.user._id);
    (0, sendResponse_1.default)(res, result);
}));
// Route: /api/v1/comments/post/:postId (GET)
const getCommentsByPostId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.CommentServices.getCommentsByPostIdFromDB(req.params.postId);
    (0, sendResponse_1.default)(res, result);
}));
exports.CommentControllers = {
    createComment,
    updateComment,
    deleteComment,
    getCommentsByPostId,
};
