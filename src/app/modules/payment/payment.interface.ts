import mongoose from 'mongoose';
import { PaymentStatus, SubscriptionTypes } from './payment.constant';

export type ISubscriptionType = (typeof SubscriptionTypes)[number];
export type IPaymentStatus = (typeof PaymentStatus)[number];

export interface IInitiatePayment {
    amount: number;
    txnId: string;
    successURL: string;
    failURL: string;
    cancelURL: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress?: string;
}

export interface IPayment {
    user: mongoose.Types.ObjectId;
    amount: number;
    subscriptionType: ISubscriptionType;
    status: IPaymentStatus;
    txnId: string;
    isDeleted: boolean;
}
