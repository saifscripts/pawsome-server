import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';

// Route: /api/v1/payment/initiate-payment (POST)
const initiatePayment = catchAsync(async (req, res) => {
    const result = await PaymentServices.initiatePaymentService(
        req.body.subscriptionType,
        req.user,
    );
    sendResponse(res, result);
});

// Route: /api/v1/payment/complete-subscription (POST)
const confirmSubscription = catchAsync(async (req, res) => {
    const result = await PaymentServices.confirmSubscription(
        req.query.TXNID as string,
    );
    res.send(result);
});

export const PaymentControllers = {
    initiatePayment,
    confirmSubscription,
};
