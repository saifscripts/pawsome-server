import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builders/QueryBuilder';
import config from '../../config';
import AppError from '../../errors/AppError';
import { USER_TYPE } from '../user/user.constant';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import {
    failPage,
    PAYMENT_STATUS,
    SUBSCRIPTION_FEE,
    SUBSCRIPTION_TYPE,
    successPage,
} from './payment.constant';
import { ISubscriptionType } from './payment.interface';
import { Payment } from './payment.model';
import {
    generateTransactionId,
    initiatePayment,
    replaceText,
    verifyPayment,
} from './payment.utils';

const initiatePaymentService = async (
    subscriptionType: ISubscriptionType,
    user: IUser, // retrieved from token
    redirectPath?: string,
) => {
    const isPremiumUser =
        user?.userType === USER_TYPE.PREMIUM &&
        user?.subscription?.endDate > new Date();

    if (isPremiumUser) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You are already a premium user!',
        );
    }
    const txnId = generateTransactionId();

    const paymentResponse = await initiatePayment({
        txnId,
        amount: SUBSCRIPTION_FEE[subscriptionType],
        successURL: `${config.base_url}/api/v1/payments/confirm-subscription?TXNID=${txnId}&redirectPath=${redirectPath || ''}`,
        failURL: `${config.base_url}/api/v1/payments/confirm-subscription?TXNID=${txnId}&redirectPath=${redirectPath || ''}`,
        cancelURL: `${config.client_base_url}${redirectPath || ''}`,
        customerName: user?.name,
        customerEmail: user?.email,
        customerPhone: user?.phone,
    });

    if (!paymentResponse?.result) {
        throw new AppError(
            httpStatus.SERVICE_UNAVAILABLE,
            'Failed to initiate payment!',
        );
    }

    await Payment.create({
        user: user._id,
        amount: SUBSCRIPTION_FEE[subscriptionType],
        subscriptionType,
        txnId,
    });

    return {
        statusCode: httpStatus.CREATED,
        message: 'Payment initiated successfully',
        data: paymentResponse,
    };
};

const confirmSubscription = async (txnId: string, redirectPath?: string) => {
    const verifyResponse = await verifyPayment(txnId);

    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const payment = await Payment.findOneAndUpdate(
                { txnId },
                { status: PAYMENT_STATUS.SUCCESS },
                { session },
            );

            if (!payment) {
                throw new AppError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    'Something went wrong!',
                );
            }

            const currentDate = new Date();
            const endDate = new Date();

            if (payment.subscriptionType === SUBSCRIPTION_TYPE.MONTHLY) {
                endDate.setMonth(endDate.getMonth() + 1);
            } else if (payment.subscriptionType === SUBSCRIPTION_TYPE.YEARLY) {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: payment.user },
                {
                    userType: USER_TYPE.PREMIUM,
                    subscription: {
                        startDate: currentDate,
                        endDate: endDate,
                    },
                },
                { session, new: true },
            );

            if (!updatedUser) {
                throw new AppError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    'Something went wrong!',
                );
            }

            // commit transaction and end session
            await session.commitTransaction();
            await session.endSession();

            return replaceText(successPage, {
                'primary-link': `${config.client_base_url}${redirectPath || ''}`,
                'primary-text': 'Continue',
            });
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            return (error as Error).message;
        }
    }

    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        await Payment.findOneAndUpdate(
            { txnId },
            { status: PAYMENT_STATUS.FAILED },
        );

        return replaceText(failPage, {
            'primary-link': `${config.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`,
            'secondary-link': `${config.client_base_url}${redirectPath || ''}`,
            'primary-text': 'Try Again',
            'secondary-text': 'Go Back',
        });
    }

    return 'Something went wrong!';
};

const getMySubscriptions = async (
    userId: mongoose.Types.ObjectId,
    query: Record<string, unknown>,
) => {
    const paymentQuery = new QueryBuilder(
        Payment.find({ user: userId, status: PAYMENT_STATUS.SUCCESS }),
        query,
    )
        // .search(PaymentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const payments = await paymentQuery.modelQuery;
    const meta = await paymentQuery.countTotal();

    return {
        statusCode: httpStatus.OK,
        message: 'Subscriptions retrieved successfully',
        data: payments,
        meta,
    };
};

export const PaymentServices = {
    initiatePaymentService,
    confirmSubscription,
    getMySubscriptions,
};
