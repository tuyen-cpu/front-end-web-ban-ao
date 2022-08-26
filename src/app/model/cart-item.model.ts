import { Size } from './size.model';

export interface CartItem {
  id: number; //productId
  name: string;
  img: string;
  size?: Size;
  price: number;
  quantity: number;
}
