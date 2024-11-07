"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_constant_1 = require("../user/user.constant");
const payment_controller_1 = require("./payment.controller");
const payment_validation_1 = require("./payment.validation");
const router = express_1.default.Router();
router
    .route('/initiate-payment')
    .post((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), (0, validateRequest_1.default)(payment_validation_1.PaymentValidations.initiatePaymentValidationSchema), payment_controller_1.PaymentControllers.initiatePayment);
router
    .route('/confirm-subscription')
    .post(payment_controller_1.PaymentControllers.confirmSubscription);
router
    .route('/my-subscriptions')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), payment_controller_1.PaymentControllers.getMySubscriptions);
exports.PaymentRoutes = router;
