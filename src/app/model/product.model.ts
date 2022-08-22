export interface Product {
  id?: number;
  name: string;
  desc: string;
  quantity: string;
  price: number;
  discount: number;
  sizeName?: string;
  urlImg: string;
  sizeId?: number;
  status?: number;
  categoryId?: number;
  groupProductId?: number;
}
export interface ProductAdd {
  id?: number;
  name?: string;
  longDescription?: string;
  price?: number;
  quantity?: number;
  discount?: number;
  sizeId?: number;
  status?: number;
  categoryId?: number;
  groupProductId?: number;
}
