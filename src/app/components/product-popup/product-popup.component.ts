import { ProductService } from './../../service/product.service';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import SwiperCore, { FreeMode, Navigation, Thumbs } from 'swiper';
import { Product } from '../../model/product.model';
import { Image } from 'src/app/model/image.model';
import { CartItem } from 'src/app/model/cart-item.model';
import { CartService } from 'src/app/service/cart.service';

SwiperCore.use([FreeMode, Navigation, Thumbs]);

@Component({
  selector: 'app-product-popup',
  templateUrl: './product-popup.component.html',
  styleUrls: ['./product-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductPopupComponent implements OnInit {
  quantity = 1;
  thumbsSwiper: any;
  images: Image[] = [];
  constructor(
    public dialogRef: MatDialogRef<ProductPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  decreaseQuantity(e: any): void {
    e.value = --e.value;
    if (e.value < 0) {
      e.value = 0;
    }
  }
  increaseQuantity(e: any): void {
    e.value = ++e.value;
  }
  getValue(element: any) {
    console.log(element.value);
  }
  ngOnInit(): void {
    this.productService
      .getImagesProduct(this.data.id||1)
      .subscribe((resp: Image[]) => {
        this.images = resp;
      });
  }

  public addToCart() {
    let item: CartItem = {
      id: this.data.id,
      name: this.data.name,
      price: this.data.price - this.data.price * this.data.discount / 100,
      quantity: this.quantity,
      img: this.data.urlImg
    };

    this.cartService.addToCart(item);
  }
}
