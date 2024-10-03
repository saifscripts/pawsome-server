import { z } from 'zod';

const signupValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name is required',
            })
            .min(1, 'Name cannot be an empty string'),
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid email address'),
        password: z
            .string({
                required_error: 'Password is required',
            })
            .min(6, 'Password must be at least 6 characters long'),
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

export const AuthValidations = {
    signupValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
    changePasswordValidationSchema,
};
