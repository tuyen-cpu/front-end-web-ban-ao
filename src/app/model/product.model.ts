export interface Product {
  id?: number;
  name: string;
  desc: string;
  quantity: string;
  price: number;
  discount: number;
  urlImg: string;
  status?: number;
  groupProductId?: number;
}
export interface ProductAdd {
  id?: number;
  name?: string;
  longDescription?: string;
  price?: number;
  quantity?: number;
  discount?: number;
  status?: number;
  categoryId?: number;
  groupProductId?: number;
}
