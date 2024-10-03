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
const mongoose_1 = __importDefault(require("mongoose"));
const payment_constant_1 = require("./payment.constant");
const payment_utils_1 = require("./payment.utils");
const initiatePayment = (_txnId) => __awaiter(void 0, void 0, void 0, function* () {
    // initiate payment
});
const confirmSubscription = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyResponse = yield (0, payment_utils_1.verifyPayment)(txnId);
    if (verifyResponse && verifyResponse.pay_status === 'Successful') {
        const session = yield mongoose_1.default.startSession();
        try {
            session.startTransaction();
            // write operations
            // commit transaction and end session
            yield session.commitTransaction();
            yield session.endSession();
            return (0, payment_utils_1.replaceText)(payment_constant_1.successPage, {
                'primary-link': `primary link`,
                'primary-text': 'primary text',
            });
        }
        catch (error) {
            yield session.abortTransaction();
            yield session.endSession();
            throw error;
        }
    }
    if (verifyResponse && verifyResponse.pay_status === 'Failed') {
        return (0, payment_utils_1.replaceText)(payment_constant_1.failPage, {
            'primary-link': `primary link`,
            'secondary-link': `secondary link`,
            'primary-text': 'primary text',
            'secondary-text': 'secondary text',
        });
    }
    return 'Something went wrong!';
});
exports.PaymentServices = {
    initiatePayment,
    confirmSubscription,
};
