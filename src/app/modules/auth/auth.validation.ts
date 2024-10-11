import validator from 'validator';
import { z } from 'zod';

const signupValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .min(1, 'Name is required')
            .min(3, 'Name must be at least 3 characters long'),
        email: z
            .string({
                required_error: 'Email is required',
            })
            .min(1, 'Email is required')
            .email('Invalid email address'),
        password: z
            .string({
                required_error: 'Password is required',
            })
            .min(1, 'Password is required')
            .min(6, 'Password must be at least 6 characters long'),
        phone: z
            .string({ required_error: 'Phone number is required' })
            .min(1, 'Phone number is required')
            .refine((value) => validator.isMobilePhone(value), {
                message: 'Invalid phone number',
            }),
    }),
});

const loginValidationSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid email address'),
        password: z.string({
            required_error: 'Password is required',
        }),
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        currentPassword: z.string({
            required_error: 'Current password is required',
        }),
        newPassword: z
            .string({
                required_error: 'Password is required',
            })
            .min(6, 'Password must be at least 6 characters long'),
    }),
});

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid email address'),
    }),
});

const resetPasswordValidationSchema = z.object({
    body: z.object({
        password: z
            .string({
                required_error: 'Password is required',
            })
            .min(6, 'Password must be at least 6 characters long'),
        token: z
            .string({
                required_error: 'Unauthorized!',
            })
            .min(1, 'Unauthorized!'),
    }),
});

export const AuthValidations = {
    signupValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
    changePasswordValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
