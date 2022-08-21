export interface Voucher {
  id: number;
  code: string;
  cost: number;
  startedDate: Date; 
  endedDate: Date;
  status:number;
  billIds: [];
  time:number;
}

