"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const validator_1 = __importDefault(require("validator"));
const zod_1 = require("zod");
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name cannot be an empty string').optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        phone: zod_1.z
            .string()
            .refine((value) => validator_1.default.isMobilePhone(value), {
            message: 'Invalid phone number',
        })
            .optional(),
    }),
});
const contactUsValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'You must provide your name!' })
            .min(1, { message: 'You must provide your name!' }),
        email: zod_1.z
            .string({ required_error: 'You must provide your email!' })
            .email({ message: 'Invalid email!' }),
        phone: zod_1.z
            .string({ required_error: 'You must provide your phone number!' })
            .refine((value) => validator_1.default.isMobilePhone(value, 'bn-BD'), {
            message: 'Invalid Bangladeshi phone number',
        }),
        message: zod_1.z
            .string({ required_error: "Message can't be empty!" })
            .min(1, { message: "Message can't be empty!" })
            .max(1000, {
            message: "Message can't be longer than 1000 characters!",
        }),
    }),
});
exports.UserValidations = {
    updateProfileValidationSchema,
    contactUsValidationSchema,
};
