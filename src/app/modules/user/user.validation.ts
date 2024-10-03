import validator from 'validator';
import { z } from 'zod';

const updateProfileValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name cannot be an empty string').optional(),
        email: z.string().email('Invalid email address').optional(),
    }),
});

const contactUsValidationSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'You must provide your name!' })
            .min(1, { message: 'You must provide your name!' }),
        email: z
            .string({ required_error: 'You must provide your email!' })
            .email({ message: 'Invalid email!' }),
        phone: z
            .string({ required_error: 'You must provide your phone number!' })
            .refine((value) => validator.isMobilePhone(value, 'bn-BD'), {
                message: 'Invalid Bangladeshi phone number',
            }),
        message: z
            .string({ required_error: "Message can't be empty!" })
            .min(1, { message: "Message can't be empty!" })
            .max(1000, {
                message: "Message can't be longer than 1000 characters!",
            }),
    }),
});

export const UserValidations = {
    updateProfileValidationSchema,
    contactUsValidationSchema,
};
