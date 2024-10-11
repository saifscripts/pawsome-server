"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const validator_1 = __importDefault(require("validator"));
const zod_1 = require("zod");
const signupValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .min(1, 'Name is required')
            .min(3, 'Name must be at least 3 characters long'),
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .min(1, 'Email is required')
            .email('Invalid email address'),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(1, 'Password is required')
            .min(6, 'Password must be at least 6 characters long'),
        phone: zod_1.z
            .string({ required_error: 'Phone number is required' })
            .min(1, 'Phone number is required')
            .refine((value) => validator_1.default.isMobilePhone(value), {
            message: 'Invalid phone number',
        }),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email address'),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required',
        }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: 'Current password is required',
        }),
        newPassword: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(6, 'Password must be at least 6 characters long'),
    }),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email address'),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(6, 'Password must be at least 6 characters long'),
        token: zod_1.z
            .string({
            required_error: 'Unauthorized!',
        })
            .min(1, 'Unauthorized!'),
    }),
});
exports.AuthValidations = {
    signupValidationSchema,
    loginValidationSchema,
    refreshTokenValidationSchema,
    changePasswordValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
