import { z } from 'zod';
import { SubscriptionTypes } from './payment.constant';

const initiatePaymentValidationSchema = z.object({
    body: z.object({
        subscriptionType: z.enum(SubscriptionTypes, {
            invalid_type_error: `Subscription type must be ${SubscriptionTypes.join('/')}`,
        }),
    }),
});

export const PaymentValidations = {
    initiatePaymentValidationSchema,
};
