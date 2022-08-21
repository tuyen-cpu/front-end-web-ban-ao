import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/model/cart-item.model';
import { DetailBill } from 'src/app/model/detail-bill.model';
import { BillService } from 'src/app/shared/bills.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss', './../cart/cart.component.scss']
})
export class BillComponent implements OnInit {
  public id!: number;
  public detailBill!: DetailBill;
  public products!: CartItem[];
  public status !: string;
  displayedColumns: string[] = ['img-product', 'name-product', 'price-product', 'quantity-product', 'total-product'];

  constructor(
    private _Activatedroute: ActivatedRoute,
    private billService: BillService,
  ) { }

  ngOnInit(): void {
    this.id = this._Activatedroute.snapshot.params['id'];
    this.getBill(this.id);
  }
  public getBill(id: number) {//id of bill
    this.billService.getBillsById(id).subscribe({
      next: res => {
        this.detailBill = res;
        let statusNumber = this.detailBill.status;
        switch (statusNumber) {
          case 0:
            this.status = 'Đang giao'
            break;
          case 1:
            this.status = 'Đã giao'
            break;
          default:
            this.status = 'Đã hủy'
            break;
        }
        this.products = this.detailBill.orderDetails;
      },
      error: err => {
        console.log("Show detail bill: " + err)
      }
    });
  }

}
