export interface Product {
  id?: number;
  name: string;
  quantity: string;
  price: number;
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
  price?: number;
  quantity?: number;
  sizeId?: number;
  status?: number;
  categoryId?: number;
  groupProductId?: number;
}
