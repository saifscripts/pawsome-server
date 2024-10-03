import catchAsync from '../../utils/catchAsync';
import { PaymentServices } from './payment.service';

// Route: /api/v1/payment/confirm-rental (POST)
const initiatePayment = catchAsync(async (req, res) => {
    const result = await PaymentServices.initiatePayment(
        req.query.TXNID as string,
    );
    res.send(result);
});

// Route: /api/v1/payment/complete-rental (POST)
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
