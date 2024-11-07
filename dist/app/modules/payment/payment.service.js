"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builders/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_constant_1 = require("../user/user.constant");
const user_model_1 = require("../user/user.model");
const payment_constant_1 = require("./payment.constant");
const payment_model_1 = require("./payment.model");
const payment_utils_1 = require("./payment.utils");
const initiatePaymentService = (subscriptionType, user, // retrieved from token
redirectPath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isPremiumUser = (user === null || user === void 0 ? void 0 : user.userType) === user_constant_1.USER_TYPE.PREMIUM &&
        ((_a = user === null || user === void 0 ? void 0 : user.subscription) === null || _a === void 0 ? void 0 : _a.endDate) > new Date();
    if (isPremiumUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You are already a premium user!');
    }
    const txnId = (0, payment_utils_1.generateTransactionId)();
    const paymentResponse = yield (0, payment_utils_1.initiatePayment)({
        txnId,
        amount: payment_constant_1.SUBSCRIPTION_FEE[subscriptionType],
        successURL: `${config_1.default.base_url}/api/v1/payments/confirm-subscription?TXNID=${txnId}&redirectPath=${redirectPath || ''}`,
        failURL: `${config_1.default.base_url}/api/v1/payments/confirm-subscription?TXNID=${txnId}&redirectPath=${redirectPath || ''}`,
        cancelURL: `${config_1.default.client_base_url}${redirectPath || ''}`,
        customerName: user === null || user === void 0 ? void 0 : user.name,
        customerEmail: user === null || user === void 0 ? void 0 : user.email,
        customerPhone: user === null || user === void 0 ? void 0 : user.phone,
    });
    if (!(paymentResponse === null || paymentResponse === void 0 ? void 0 : paymentResponse.result)) {
        throw new AppError_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Failed to initiate payment!');
    }
    yield payment_model_1.Payment.create({
        user: user._id,
        amount: payment_constant_1.SUBSCRIPTION_FEE[subscriptionType],
        subscriptionType,
        txnId,
    });
    return {
        statusCode: http_status_1.default.CREATED,
        message: 'Payment initiated successfully',
        data: paymentResponse,
    };
});
const confirmSubscription = (txnId, redirectPath) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(txnId);
    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const payment = yield payment_model_1.Payment.findOneAndUpdate({ txnId }, { status: payment_constant_1.PAYMENT_STATUS.SUCCESS }, { session });
            if (!payment) {
                throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong!');
            }
            const currentDate = new Date();
            const endDate = new Date();
            if (payment.subscriptionType === payment_constant_1.SUBSCRIPTION_TYPE.MONTHLY) {
                endDate.setMonth(endDate.getMonth() + 1);
            }
            else if (payment.subscriptionType === payment_constant_1.SUBSCRIPTION_TYPE.YEARLY) {
                endDate.setFullYear(endDate.getFullYear() + 1);
            }
            const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: payment.user }, {
                userType: user_constant_1.USER_TYPE.PREMIUM,
                subscription: {
                    startDate: currentDate,
                    endDate: endDate,
                },
            }, { session, new: true });
            if (!updatedUser) {
                throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Something went wrong!');
            }
            // commit transaction and end session
            yield session.commitTransaction();
            yield session.endSession();
            return (0, payment_utils_1.replaceText)(payment_constant_1.successPage, {
                'primary-link': `${config_1.default.client_base_url}${redirectPath || ''}`,
                'primary-text': 'Continue',
            });
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            return error.message;
        }
    }
    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        yield payment_model_1.Payment.findOneAndUpdate({ txnId }, { status: payment_constant_1.PAYMENT_STATUS.FAILED });
        return (0, payment_utils_1.replaceText)(payment_constant_1.failPage, {
            'primary-link': `${config_1.default.payment_base_url}/payment_page.php?track_id=${verifyResponse.pg_txnid}`,
            'secondary-link': `${config_1.default.client_base_url}${redirectPath || ''}`,
            'primary-text': 'Try Again',
            'secondary-text': 'Go Back',
        });
    }
    return 'Something went wrong!';
});
const getMySubscriptions = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentQuery = new QueryBuilder_1.default(payment_model_1.Payment.find({ user: userId, status: payment_constant_1.PAYMENT_STATUS.SUCCESS }), query)
        // .search(PaymentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const payments = yield paymentQuery.modelQuery;
    const meta = yield paymentQuery.countTotal();
    return {
        statusCode: http_status_1.default.OK,
        message: 'Subscriptions retrieved successfully',
        data: payments,
        meta,
    };
});
exports.PaymentServices = {
    initiatePaymentService,
    confirmSubscription,
    getMySubscriptions,
};
