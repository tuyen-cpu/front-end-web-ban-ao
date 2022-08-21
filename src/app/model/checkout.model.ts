import { Address } from "./address.model";
import { CartItem } from "./cart-item.model";

export interface Checkout{
    address: Address;
    voucherCodes: string[];
    shipCost: number,
    cart: CartItem[],
    userId: number,
    total:number,
    note:string,
  }