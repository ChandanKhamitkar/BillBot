export interface ItemsTypes{
    itemName: string;
    quantity: string;
    price: string;
}

export interface DisplayDataTypes {
    businessDetails: BusinessDetailsTypes;
    data: CustomerDetailsTypes
}

interface CustomerDetailsTypes{
    name: string;
    phone: string;
    items: ItemsTypes[];
    total : string;
    shipping: string;
    grandTotal: string;
    templateNo?: number;
}

export interface BusinessDetailsTypes{
    email?: string | null;
    businessName?: string | null;
    ownerName?: string | null;
    address?: string | null;
    UPIID?: string | null;
    logo?: string | null;
    gstPercent?: number;
    templateNo?: number;
}