"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_route_1 = require("../modules/admin/admin.route");
const auth_route_1 = require("../modules/auth/auth.route");
const comment_route_1 = require("../modules/comment/comment.route");
const payment_route_1 = require("../modules/payment/payment.route");
const post_route_1 = require("../modules/post/post.route");
const user_route_1 = require("../modules/user/user.route");
const router = express_1.default.Router();
const routes = [
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/users', route: user_route_1.UserRoutes },
    { path: '/admin', route: admin_route_1.AdminRoutes },
    { path: '/payments', route: payment_route_1.PaymentRoutes },
    { path: '/posts', route: post_route_1.PostRoutes },
    { path: '/comments', route: comment_route_1.CommentRoutes },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
