import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const routes = [
    { path: '/auth', route: AuthRoutes },
    { path: '/users', route: UserRoutes },
    { path: '/payment', route: PaymentRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
