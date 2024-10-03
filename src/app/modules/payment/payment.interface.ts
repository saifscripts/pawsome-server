export interface IPaymentData {
    amount: number;
    txnId: string;
    successURL: string;
    failURL: string;
    cancelURL: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerAddress?: string;
}
