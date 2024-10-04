import express from 'express';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CommentRoutes } from '../modules/comment/comment.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { PostRoutes } from '../modules/post/post.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const routes = [
    { path: '/auth', route: AuthRoutes },
    { path: '/users', route: UserRoutes },
    { path: '/admin', route: AdminRoutes },
    { path: '/payment', route: PaymentRoutes },
    { path: '/posts', route: PostRoutes },
    { path: '/comments', route: CommentRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
