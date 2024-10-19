"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidations = void 0;
const zod_1 = require("zod");
const post_constant_1 = require("./post.constant");
const createPostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ required_error: 'Title is required' })
            .min(1, { message: 'Title is required' })
            .max(200, { message: 'Title must not exceed 200 characters' }),
        summary: zod_1.z
            .string({ required_error: 'Summary is required' })
            .min(50, {
            message: 'Post summary must be at least 50 characters long.',
        })
            .max(300, {
            message: 'Post summary cannot exceed 300 characters.',
        }),
        content: zod_1.z
            .string({ required_error: 'Content is required' })
            .min(1, { message: 'Content is required' }),
        category: zod_1.z.enum(post_constant_1.PostCategories, {
            required_error: 'Category is required',
            invalid_type_error: 'Category must be Tip or Story',
        }),
        tags: zod_1.z
            .array(zod_1.z.string({ invalid_type_error: 'Tags must be string' }))
            .transform((tags) => tags.filter((tag) => Boolean(tag)))
            .optional(),
        // imageUrls: z.array(z.string().url('Invalid image url')).optional(),
        isPremium: zod_1.z.boolean().optional(),
    }),
});
const updatePostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({ required_error: 'Title is required' })
            .min(1, { message: 'Title is required' })
            .max(200, { message: 'Title must not exceed 200 characters' })
            .optional(),
        summary: zod_1.z
            .string({ required_error: 'Summary is required' })
            .min(50, {
            message: 'Post summary must be at least 50 characters long.',
        })
            .max(300, {
            message: 'Post summary cannot exceed 300 characters.',
        })
            .optional(),
        content: zod_1.z
            .string({ required_error: 'Content is required' })
            .min(1, { message: 'Content is required' })
            .optional(),
        category: zod_1.z
            .enum(post_constant_1.PostCategories, {
            required_error: 'Category is required',
            invalid_type_error: 'Category must be Tip or Story',
        })
            .optional(),
        tags: zod_1.z
            .array(zod_1.z.string({ invalid_type_error: 'Tags must be string' }))
            .transform((tags) => tags.filter((tag) => Boolean(tag)))
            .optional(),
        featuredImage: zod_1.z.string().url('Invalid image url').optional(),
        isPremium: zod_1.z.boolean().optional(),
    }),
});
exports.PostValidations = {
    createPostValidationSchema,
    updatePostValidationSchema,
};
