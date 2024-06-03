interface IAddress {
    line1: string;
    city: string;
    postal_code: string;
    state: string;
    country: string
}
interface IDestination {
    account: string; // stripe account id
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