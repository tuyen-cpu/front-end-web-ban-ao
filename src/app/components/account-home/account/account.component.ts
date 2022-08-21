import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Bill } from 'src/app/model/bill.model';
import { User } from 'src/app/model/user.model';
import { StorageService } from 'src/app/service/storage.service';
import { BillService } from 'src/app/shared/bills.service';
export interface Order {
  id: string;
  date: string;
  address: string;
  total: number;
  statusCheckout: string;
  status: string;
}

const ELEMENT_DATA: Order[] = [
  {
    id: '10000',
    date: '10/10/2000',
    address: 'An Phú',
    total: 10000,
    statusCheckout: 'Đã thanh toán',
    status: 'Đã giao',
  },
  {
    id: '10000',
    date: '10/10/2000',
    address: 'An Phú',
    total: 10000,
    statusCheckout: 'Đã thanh toán',
    status: 'Đã giao',
  },
  {
    id: '10000',
    date: '10/10/2000',
    address: 'An Phú',
    total: 10000,
    statusCheckout: 'Đã thanh toán',
    status: 'Đã giao',
  },
  {
    id: '10000',
    date: '10/10/2000',
    address: 'An Phú',
    total: 10000,
    statusCheckout: 'Đã thanh toán',
    status: 'Đã giao',
  },
];
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  displayedColumns: string[] = [
    'order-id',
    'date',
    'address',
    'total',
    'status',
  ];
  billList: Bill[] = [];
  lastBill!: Bill;

  constructor(
    private billService: BillService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
  ) {}
  public user!: User;
  ngOnInit(): void {
    this.loadUser();
    this.billService.getBillsByUserId(this.user.id).subscribe((data) => {
      this.billList = data;
      console.log(this.billList);
      this.getLastBill();
    });
   
  }
  loadUser() {
    this.user=this.storageService.getUser();
  }
  getLastBill(){
    let length:number = this.billList.length;
    if(length>0){
      this.lastBill=this.billList[length-1];
    }
    console.log("Last"+ this.lastBill)
  }
  navigateToAddress() {
    this.router.navigate(['address'], { relativeTo: this.activatedRoute });
  }
}


