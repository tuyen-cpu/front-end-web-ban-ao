import { Component, Input, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CartItem } from 'src/app/model/cart-item.model';
import { Product } from 'src/app/model/product.model';
import { CartService } from 'src/app/service/cart.service';
import { ProductPopupComponent } from '../product-popup/product-popup.component';

@Component({
  selector: 'app-item-product',
  templateUrl: './item-product.component.html',
  styleUrls: ['./item-product.component.scss'],
})
export class ItemProductComponent implements OnInit {
  @Input() productItem!: Product;
  name!: string;

  @Input() textHere: string = '';
  openDialog(): void {
    const dialogRef = this.dialog.open(ProductPopupComponent, {
      width: '970px',
      data: this.productItem,
    });
  }
  constructor(public dialog: MatDialog, private cartService: CartService) {}

  ngOnInit(): void {
    //this.productItem = new Product(1,' Laptop Gaming Gigabyte AORUS 17 XE5-73VN534GH (i7-12700H, RTX 3070 Ti 8GB, Ram 16GB DDR5, SSD 1TB, 17.3 Inch IPS 360Hz FHD) ','','Intel',60660990,10,'https://bizweb.sapocdn.net/thumb/medium/100/329/122/products/laptop-gaming-gigabyte-aorus-17-xe5-73vn534gh.png?v=1648702456000')
  }


  public addToCart(Id: any){
    let item: CartItem = {
      id: Id,
      name: this.productItem.name,
      img: this.productItem.urlImg,
      price:
        this.productItem.price -
        (this.productItem.price * this.productItem.discount) / 100,
      quantity: 1,
    };

    this.cartService.addToCart(item);
  }
}
