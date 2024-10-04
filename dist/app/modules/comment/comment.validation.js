"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidations = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const createCommentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        postId: zod_1.z
            .string({
            required_error: 'Post ID is required',
        })
            .refine((value) => mongoose_1.default.Types.ObjectId.isValid(value), {
            message: 'Invalid Post ID',
        }),
        content: zod_1.z
            .string({
            required_error: 'Content is required',
        })
            .min(1, 'Content cannot be empty')
            .max(200, 'Content must not exceed 200 characters'),
    }),
});
const updateCommentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z
            .string({
            required_error: 'Content is required',
        })
            .min(1, 'Content cannot be empty')
            .max(200, 'Content must not exceed 200 characters'),
    }),
});
exports.CommentValidations = {
    createCommentValidationSchema,
    updateCommentValidationSchema,
};
