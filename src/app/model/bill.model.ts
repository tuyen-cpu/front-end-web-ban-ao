export interface Bill {
  id: number;
  shippingCost: number;
  total: number;
  status: number; // 0: dang giao, 1:da giao, 2:huy
  createdDate: Date;
  updatedDate: Date;
  stringAddress:string;
  currentPhone: string;
}
