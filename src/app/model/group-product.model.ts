import { ProductAdd } from './product.model';
export interface GroupProduct {
  id?: number;
  name?: string;
  discount?: number;
  description?: string;
  status?: number;
  urlImage?: string;
  categoryId?: number;
  products?: ProductAdd[];
}
