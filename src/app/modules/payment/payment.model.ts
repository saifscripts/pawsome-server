import mongoose, { Schema, model } from 'mongoose';
import {
    PAYMENT_STATUS,
    PaymentStatus,
    SubscriptionTypes,
} from './payment.constant';
import { IPayment } from './payment.interface';

const PaymentSchema = new Schema<IPayment>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: { type: Number, required: true },
        subscriptionType: {
            type: String,
            enum: SubscriptionTypes,
            required: true,
        },
        status: {
            type: String,
            enum: PaymentStatus,
            default: PAYMENT_STATUS.PENDING,
        },
        txnId: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

// Query Middlewares
PaymentSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

PaymentSchema.pre('findOne', function (next) {
    if (this.getOptions().getDeletedDocs) {
        return next();
    }

    this.find({ isDeleted: { $ne: true } });
    next();
});

PaymentSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const Payment = model<IPayment>('Payment', PaymentSchema);
