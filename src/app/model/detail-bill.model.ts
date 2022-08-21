import { CartItem } from "./cart-item.model";

export interface DetailBill {
    "id": number,
    "fullname": string,
    "phone": string,
    "address": string,
    "method": string,
    "shippingTime": string,
    "voucherCost": number,
    "street": string,
    "company": string,
    "createdDate": Date,
    "updatedDate": Date,
    "status": number,
    "total": number,
    "shippingCost": number,
    "orderDetails": CartItem[],
    "note": string,
}
