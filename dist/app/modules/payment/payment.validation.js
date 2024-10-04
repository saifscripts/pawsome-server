"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidations = void 0;
const zod_1 = require("zod");
const payment_constant_1 = require("./payment.constant");
const initiatePaymentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        subscriptionType: zod_1.z.enum(payment_constant_1.SubscriptionTypes, {
            invalid_type_error: `Subscription type must be ${payment_constant_1.SubscriptionTypes.join('/')}`,
        }),
    }),
});
exports.PaymentValidations = {
    initiatePaymentValidationSchema,
};
