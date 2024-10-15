import { z } from 'zod';
import { PostCategories } from './post.constant';

const createPostValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ required_error: 'Title is required' })
            .min(1, { message: 'Title is required' })
            .max(200, { message: 'Title must not exceed 200 characters' }),
        summary: z
            .string({ required_error: 'Summary is required' })
            .min(50, {
                message: 'Post summary must be at least 50 characters long.',
            })
            .max(300, {
                message: 'Post summary cannot exceed 300 characters.',
            }),
        content: z
            .string({ required_error: 'Content is required' })
            .min(1, { message: 'Content is required' }),
        category: z.enum(PostCategories, {
            required_error: 'Category is required',
            invalid_type_error: 'Category must be Tip or Story',
        }),
        // imageUrls: z.array(z.string().url('Invalid image url')).optional(),
        isPremium: z.boolean().optional(),
    }),
});

const updatePostValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ required_error: 'Title is required' })
            .min(1, { message: 'Title is required' })
            .max(200, { message: 'Title must not exceed 200 characters' })
            .optional(),
        summary: z
            .string({ required_error: 'Summary is required' })
            .min(50, {
                message: 'Post summary must be at least 50 characters long.',
            })
            .max(300, {
                message: 'Post summary cannot exceed 300 characters.',
            })
            .optional(),
        content: z
            .string({ required_error: 'Content is required' })
            .min(1, { message: 'Content is required' })
            .optional(),
        category: z
            .enum(PostCategories, {
                required_error: 'Category is required',
                invalid_type_error: 'Category must be Tip or Story',
            })
            .optional(),
        featuredImage: z.string().url('Invalid image url').optional(),
        isPremium: z.boolean().optional(),
    }),
});

export const PostValidations = {
    createPostValidationSchema,
    updatePostValidationSchema,
};
