import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { PaymentControllers } from './payment.controller';
import { PaymentValidations } from './payment.validation';

const router = express.Router();

router
    .route('/initiate-payment')
    .post(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        validateRequest(PaymentValidations.initiatePaymentValidationSchema),
        PaymentControllers.initiatePayment,
    );
router
    .route('/confirm-subscription')
    .post(PaymentControllers.confirmSubscription);

router
    .route('/my-subscriptions')
    .get(
        auth(USER_ROLE.ADMIN, USER_ROLE.USER),
        PaymentControllers.getMySubscriptions,
    );

export const PaymentRoutes = router;
