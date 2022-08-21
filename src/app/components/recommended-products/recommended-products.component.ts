import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product.model';

@Component({
  selector: 'app-recommended-products',
  templateUrl: './recommended-products.component.html',
  styleUrls: ['./recommended-products.component.scss'],
})
export class RecommendedProductsComponent implements OnInit {
  public listProduct: Product[] = [];
  public productItem!: Product;

  constructor() {}

  ngOnInit(): void {
    for (let index = 0; index < 5; index++) {
      this.listProduct.push(this.productItem);
    }
  }
}
