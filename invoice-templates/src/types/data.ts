export interface ItemsTypes{
    itemName: string;
    quantity: string;
    price: string;
}

export interface DisplayDataTypes {
    name: string;
    phone: string;
    items: ItemsTypes[];
    total : string;
    shipping: string;
    grandTotal: string;
}