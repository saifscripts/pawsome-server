import axios from 'axios';
import config from '../../config';
import { IInitiatePayment } from './payment.interface';

export const generateTransactionId = () => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 9);
    return `TXN-${timestamp}-${randomString}`.toUpperCase();
};

export const initiatePayment = async (paymentData: IInitiatePayment) => {
    const response = await axios.post(
        `${config.payment_base_url}/jsonpost.php`!,
        {
            store_id: config.store_id,
            signature_key: config.signature_key,
            tran_id: paymentData.txnId,
            success_url: paymentData.successURL,
            fail_url: paymentData.failURL,
            cancel_url: paymentData.cancelURL,
            amount: paymentData.amount,
            currency: 'BDT',
            desc: 'Merchant Registration Payment',
            cus_name: paymentData?.customerName,
            cus_email: paymentData?.customerEmail,
            cus_phone: paymentData?.customerPhone,
            cus_add1: paymentData?.customerAddress,
            cus_country: 'Bangladesh',
            type: 'json',
        },
    );

    return response.data;
};

export const verifyPayment = async (txnId: string) => {
    const response = await axios.get(
        `${config.payment_base_url}/api/v1/trxcheck/request.php`!,
        {
            params: {
                store_id: config.store_id,
                signature_key: config.signature_key,
                request_id: txnId,
                type: 'json',
            },
        },
    );

    return response.data;
};

// replace the text with the actual text
export const replaceText = (
    template: string,
    replacements: { [key: string]: string },
) => {
    return template.replace(
        /{{(.*?)}}/g,
        (match, p1) => replacements[p1] || match,
    );
};
