import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import SwiperCore, { Pagination } from "swiper";
SwiperCore.use([Pagination]);
@Component({
  selector: 'app-viewed-products',
  templateUrl: './viewed-products.component.html',
  styleUrls: ['./viewed-products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewedProductsComponent implements OnInit {
  
  public listProduct = new Array(10);
  
  constructor() { }

  ngOnInit(): void {
  }

}
