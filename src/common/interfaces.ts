interface IAddress {
    line1: string;
    city: string;
    postal_code: string;
    state: string;
    country: string
}
interface IDestination {
    account: string;
    amount: number;
}

interface ITransferData {
    destination: string;
    amount: number;
}

interface ICharge {
    amount: number;
    currency: string;
    stripe_customer_id: string;
    description: string;
    receipt_email: string;
    destination: IDestination;
    shipping?: IShipping;
    transfer_data?: ITransferData;
}

interface IShipping {
    address: IAddress;
    name: string;
    carrier: string;
    phone: string;
    tracking_number: string;
}

type PaymentMethodType =
    | 'acss_debit'
    | 'affirm'
    | 'afterpay_clearpay'
    | 'alipay'
    | 'amazon_pay'
    | 'au_becs_debit'
    | 'bacs_debit'
    | 'bancontact'
    | 'blik'
    | 'boleto'
    | 'card'
    | 'cashapp'
    | 'customer_balance'
    | 'eps'
    | 'fpx'
    | 'giropay'
    | 'grabpay'
    | 'ideal'
    | 'klarna'
    | 'konbini'
    | 'link'
    | 'mobilepay'
    | 'oxxo'
    | 'p24'
    | 'paynow'
    | 'paypal'
    | 'pix'
    | 'promptpay'
    | 'revolut_pay'
    | 'sepa_debit'
    | 'sofort'
    | 'swish'
    | 'us_bank_account'
    | 'wechat_pay'
    | 'zip';