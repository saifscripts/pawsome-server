import { z } from 'zod';
import { PostCategories } from './post.constant';

const createPostValidationSchema = z.object({
    body: z.object({
        title: z
            .string({ required_error: 'Title is required' })
            .min(1, { message: 'Title is required' })
            .max(200, { message: 'Title must not exceed 200 characters' }),
        content: z
            .string({ required_error: 'Content is required' })
            .min(1, { message: 'Content is required' }),
        category: z.enum(PostCategories, {
            required_error: 'Category is required',
            invalid_type_error: 'Category must be Tip or Story',
        }),
        imageUrls: z.array(z.string().url('Invalid image url')).optional(),
        isPremium: z.boolean().optional(),
    }),
});

export const PostValidations = {
    createPostValidationSchema,
};
