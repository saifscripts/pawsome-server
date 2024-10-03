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
exports.replaceText = exports.verifyPayment = exports.initiatePayment = exports.generateTransactionId = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const generateTransactionId = () => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 9);
    return `TXN-${timestamp}-${randomString}`.toUpperCase();
};
exports.generateTransactionId = generateTransactionId;
const initiatePayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`${config_1.default.payment_base_url}/jsonpost.php`, {
        store_id: config_1.default.store_id,
        signature_key: config_1.default.signature_key,
        tran_id: paymentData.txnId,
        success_url: paymentData.successURL,
        fail_url: paymentData.failURL,
        cancel_url: paymentData.cancelURL,
        amount: paymentData.amount,
        currency: 'BDT',
        desc: 'Merchant Registration Payment',
        cus_name: paymentData === null || paymentData === void 0 ? void 0 : paymentData.customerName,
        cus_email: paymentData === null || paymentData === void 0 ? void 0 : paymentData.customerEmail,
        cus_phone: paymentData === null || paymentData === void 0 ? void 0 : paymentData.customerPhone,
        cus_add1: paymentData === null || paymentData === void 0 ? void 0 : paymentData.customerAddress,
        cus_country: 'Bangladesh',
        type: 'json',
    });
    return response.data;
});
exports.initiatePayment = initiatePayment;
const verifyPayment = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${config_1.default.payment_base_url}/api/v1/trxcheck/request.php`, {
        params: {
            store_id: config_1.default.store_id,
            signature_key: config_1.default.signature_key,
            request_id: txnId,
            type: 'json',
        },
    });
    return response.data;
});
exports.verifyPayment = verifyPayment;
// replace the text with the actual text
const replaceText = (template, replacements) => {
    return template.replace(/{{(.*?)}}/g, (match, p1) => replacements[p1] || match);
};
exports.replaceText = replaceText;
