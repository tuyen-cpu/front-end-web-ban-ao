import { ProductAdd } from './product.model';
export interface GroupProduct {
  id?: number;
  name?: string;
  price?: number;
  discount?: number;
  description?: string;
  status?: number;
  urlImage?: string;
  categoryId?: number;
  products?: ProductAdd[];
}
