import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
// import Swiper core and required modules
import SwiperCore, {Pagination, Navigation} from "swiper";

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RelatedProductsComponent implements OnInit {
  @Input()
  category!: string;

  public listProduct = new Array(10);
  constructor() { }

  ngOnInit(): void {
  }

}
