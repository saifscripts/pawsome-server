import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';

// Route: /api/v1/payment/initiate-payment (POST)
const initiatePayment = catchAsync(async (req, res) => {
    const result = await PaymentServices.initiatePaymentService(
        req.body.subscriptionType,
        req.user,
        req.query.redirectPath as string,
    );
    sendResponse(res, result);
});

// Route: /api/v1/payment/complete-subscription (POST)
const confirmSubscription = catchAsync(async (req, res) => {
    const result = await PaymentServices.confirmSubscription(
        req.query.TXNID as string,
        req.query.redirectPath as string,
    );
    res.send(result);
});

// Route: /api/v1/payment/my-subscriptions (GET)
const getMySubscriptions = catchAsync(async (req, res) => {
    const result = await PaymentServices.getMySubscriptions(
        req.user._id,
        req.query,
    );

    sendResponse(res, result);
});

export const PaymentControllers = {
    initiatePayment,
    confirmSubscription,
    getMySubscriptions,
};
