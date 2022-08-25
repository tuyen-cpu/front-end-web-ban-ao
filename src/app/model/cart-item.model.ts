import { Size } from './size.model';

export interface CartItem {
  id: number; //productId
  name: string;
  img: string;
  size?: number;
  price: number;
  quantity: number;
}
