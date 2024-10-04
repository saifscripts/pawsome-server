import mongoose from 'mongoose';
import { z } from 'zod';

const createCommentValidationSchema = z.object({
    body: z.object({
        postId: z
            .string({
                required_error: 'Post ID is required',
            })
            .refine((value) => mongoose.Types.ObjectId.isValid(value), {
                message: 'Invalid Post ID',
            }),
        content: z
            .string({
                required_error: 'Content is required',
            })
            .min(1, 'Content cannot be empty')
            .max(200, 'Content must not exceed 200 characters'),
    }),
});

const updateCommentValidationSchema = z.object({
    body: z.object({
        content: z
            .string({
                required_error: 'Content is required',
            })
            .min(1, 'Content cannot be empty')
            .max(200, 'Content must not exceed 200 characters'),
    }),
});

export const CommentValidations = {
    createCommentValidationSchema,
    updateCommentValidationSchema,
};
