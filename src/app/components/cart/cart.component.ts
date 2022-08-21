import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CartItem } from 'src/app/model/cart-item.model';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { StorageService } from 'src/app/service/storage.service';
// export interface CartItem {
//   name: sPC văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W);
//   img: string;
//   price:number;
//   quantity: number;
// }
//
// const ELEMENT_DATA: CartItem[] = [
//   {name:'PPC văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W) văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W)',img: 'https://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.pnghttps://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.png',price:100,quantity:10,},
//   {name:'PPC văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W) văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W)',img: 'https://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.pnghttps://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.png',price:100,quantity:10,},
//   {name:'PPC văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W) văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W)',img: 'https://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.pnghttps://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.png',price:100,quantity:10,},
//   {name:'PPC văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W) văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W)',img: 'https://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.pnghttps://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.png',price:100,quantity:10,},
//   {name:'PPC văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W) văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W)',img: 'https://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.pnghttps://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.png',price:100,quantity:10,},
//   {name:'PPC văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W) văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W)',img: 'https://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.pnghttps://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.png',price:100,quantity:10,},
//   {name:'PPC văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W) văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W)',img: 'https://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.pnghttps://bizweb.dktcdn.net/thumb/small/100/329/122/products/pc-van-phong-st-vp03.png',price:100,quantity:10,},
//
// ];

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  // displayedColumns: string[] = [' name-prPC văn phòng ST-VP03 (i3-10105 , Ram 8GB, SSD 250GB, 550W)', 'img-product', 'price-product', 'quantity-product','total-product','  action-product'];
  displayedColumns: string[] = ['img-product', 'name-product', 'price-product', 'quantity-product', 'total-product', 'action-product'];
  dataSource: CartItem[] = [];
  totalCart: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) { }
  decreaseQuantity(e: any, id:number): void {
    e.value = --e.value;
    if (e.value <= 0) {
      e.value = 1
    }
    let quantity= e.value;
    this.cartService.updateCartItem(id,quantity);
  }
  increaseQuantity(e: any, id:number): void {
    e.value = ++e.value;
    let quantity= e.value;
    this.cartService.updateCartItem(id,quantity);
    this.productService.getQuantityProductById(id).subscribe({
      next: res => {
        if(res<quantity){
          const msg = document.getElementById('msg-quantity-' + id) as HTMLDivElement | null;
          if(msg){
            msg.setAttribute('style', 'display: block;');
            setTimeout(function () {
              msg.setAttribute('style', 'display: none;');
            }, 3000);
           }
           e.value = res;
        }
      }
    });
  }
  getTotal(): void {
    this.totalCart = this.dataSource.reduce((previousValue, currentValue) => previousValue + (currentValue.quantity * currentValue.price), 0)
  }
  ngOnInit(): void {
    //get list cart item
    this.loadListCartItem();
  }

  public loadListCartItem() {
    this.cartService.getCart().subscribe(res=>{
      this.dataSource = res;
      //load total price
      this.getTotal();
      this.refreshTable();
    });
  }
  updateQuantity(ele: any, id: number): void {
    let quantity= ele.value;
    this.cartService.updateCartItem(id,quantity);
    this.productService.getQuantityProductById(id).subscribe({
      next: res => {
        if(res<quantity){
          const msg = document.getElementById('msg-quantity-' + id) as HTMLDivElement | null;
          if(msg){
            msg.setAttribute('style', 'display: block;');
            setTimeout(function () {
              msg.setAttribute('style', 'display: none;');
            }, 3000);
           }
           ele.value = res;
        }
      }
    });
  }

  public deleteCartItem(id: number){
    this.cartService.removeCartItem(id);
    console.log(this.dataSource);
    this.refreshTable();
  }

  dataSourceTable = new MatTableDataSource<CartItem>();
  private refreshTable() {
    this.dataSourceTable.data=this.dataSource;
}
}



