import { GroupProduct } from './../../model/group-product.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from 'src/app/model/product.model';
import { SwiperComponent } from 'swiper/angular';

// import Swiper core and required modules
import SwiperCore, { Zoom, FreeMode, Navigation, Thumbs } from 'swiper';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DetailProduct } from 'src/app/model/detail-product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ItemProductComponent } from '../item-product/item-product.component';
import { CartItem } from 'src/app/model/cart-item.model';
import { CartService } from 'src/app/service/cart.service';
import { DetailComment } from 'src/app/model/comment.model';
import { User } from 'src/app/model/user.model';
import { StorageService } from 'src/app/service/storage.service';
import { CommentService } from 'src/app/service/comment.service';
import { FileService } from 'src/app/service/file.service';
import { Image } from 'src/app/model/image.model';
import { Size } from 'src/app/model/size.model';

// install Swiper modules
SwiperCore.use([Zoom, FreeMode, Navigation, Thumbs]);

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailProductComponent implements OnInit {
  //percent of rating
  percentComments = [];
  average = 0;
  //load image comment
  images: Image[];
  files: File[] = [];
  removeImgFiles = [];
  sizes: Size[] = [];
  thumbsSwiper: any;
  private id!: number;
  public groupProduct: GroupProduct = { name: 'má ' };
  public quantity = 1;
  sizeSelected: number = 1;

  // public textFull = false;
  public number_star = 0;
  public openFormReview = false;
  public reviewForm: FormGroup = new FormGroup({
    numberStar: new FormControl(''),
    content: new FormControl(''),
    fullName: new FormControl(''),
    phone: new FormControl(''),
    imgFiles: new FormControl(''),
  });

  public star_title: { id: number; title: string }[] = [
    { id: 1, title: 'Không thích' },
    { id: 2, title: 'Tạm được' },
    { id: 3, title: 'Bình thường' },
    { id: 4, title: 'Rất tốt' },
    { id: 5, title: 'Quá tuyệt vời!' },
  ];

  public user!: User;
  //comments
  public comments: DetailComment[] = [];
  public totalPages: number = 0;
  public currentPage: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    console.log(this.id);
    this.getDetailProduct(this.id);
    this.productService.getImagesByGroupProductId(this.id).subscribe({
      next: (resp) => {
        console.log(resp.data);
        this.images = resp.data;
      },
      error: (error) => {
        alert(error.message);
      },
    });
  }

  public getDetailProduct(productId: number): void {
    this.productService.getGroupProductById(productId).subscribe(
      (response) => {
        this.groupProduct = response.data;
        console.log(this.groupProduct);
        this.groupProduct.products.forEach((product: any) => {
          console.log(product);
          this.sizes.push({ id: product.sizeId, name: product.sizeName });
        });
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  // public showMore(): void {
  //   let myContainer = document.getElementById('show-more') as HTMLInputElement;

  //   if (this.textFull == false) {
  //     myContainer.innerHTML = this.groupProduct.description + '';
  //   } else {
  //     myContainer.innerHTML = '';
  //   }
  //   this.textFull = !this.textFull;
  // }

  formatPrice(value: number): string {
    let val = (value / 1).toFixed(0).replace('.', ',');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  public addToCart() {
    console.log(this.sizeSelected);
    let item: CartItem = {
      id: this.id,
      name: this.groupProduct.name,
      img: this.groupProduct.urlImage,
      price:
        this.groupProduct.price -
        (this.groupProduct.price * this.groupProduct.discount) / 100,
      size: this.sizeSelected,
      quantity: this.quantity,
    };

    this.cartService.addToCart(item);
  }
}
