import mongoose from 'mongoose';
import { failPage, successPage } from './payment.constant';
import { replaceText, verifyPayment } from './payment.utils';

const initiatePayment = async (_txnId: string) => {
    // initiate payment
};

const confirmSubscription = async (txnId: string) => {
    const verifyResponse = await verifyPayment(txnId);

    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();
            // write operations

            // commit transaction and end session
            await session.commitTransaction();
            await session.endSession();

            return replaceText(successPage, {
                'primary-link': `primary link`,
                'primary-text': 'primary text',
            });
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            throw error;
        }
    }

    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        return replaceText(failPage, {
            'primary-link': `primary link`,
            'secondary-link': `secondary link`,
            'primary-text': 'primary text',
            'secondary-text': 'secondary text',
        });
    }

    return 'Something went wrong!';
};

export const PaymentServices = {
    initiatePayment,
    confirmSubscription,
};
