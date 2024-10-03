import express from 'express';
import { PaymentControllers } from './payment.controller';

const router = express.Router();

router.route('/initiate-payment').post(PaymentControllers.initiatePayment);
router
    .route('/confirm-subscription')
    .post(PaymentControllers.confirmSubscription);

export const PaymentRoutes = router;
