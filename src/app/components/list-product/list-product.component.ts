import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  ChangeContext,
  Options,
  PointerType,
} from '@angular-slider/ngx-slider';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Attribute, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Paginator } from 'primeng/paginator';
import { AttributeProduct } from 'src/app/model/attribute-product.model';
import { Pagination } from 'src/app/model/pagination.model';
import { Product } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';
import { ProductPopupComponent } from '../product-popup/product-popup.component';
import { debounceTime } from 'rxjs';
import { GroupProduct } from 'src/app/model/group-product.model';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit {
  public categoryId!: string;
  page: number = 1;
  size: number = 3;
  totalPages!: number;
  params: any = {};
  private sort = 'default';

  public groupProducts: GroupProduct[] = [];
  public view_list = false;
  isLoading: boolean = false;

  //slider
  minValue: number = 0;
  maxValue: number = 110000000;
  options: Options = {
    floor: 0,
    ceil: 110000000,
    step: 1,
    noSwitching: true,
    getPointerColor: (value: number): string => {
      return '#000';
    },
    translate: (value: number): string => {
      return '';
    },
    getSelectionBarColor: (value: number): string => {
      return '#000';
    },
  };
  productItem!: Product;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getParamsUrl();
  }
  trackById(index: number, item: any) {
    return item.id;
  }
  onUserChangeEnd(changeContext: ChangeContext): void {
    this.params['price_lte'] = changeContext.highValue;
    this.params['price_gte'] = changeContext.value;
  }

  formatPrice(value: number): string {
    let val = (value / 1).toFixed(0).replace('.', ',');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  }

  onFilterPrice() {
    this.changeUrl();
  }

  onPageChange(event: any) {
    this.params['page'] = event.page + 1;
    this.params['size'] = 3;
    console.log('change page', this.params);
    this.changeUrl();
  }

  changeUrl() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: this.params,
    });
  }

  getParamsUrl() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.categoryId = paramMap.get('cateId')!;
      if (!this.categoryId) {
        this.getProducts({
          size: this.size,
          page: 0,
        });
      } else {
        this.getProductByCategoryId(+this.categoryId, {
          size: this.size,
          page: 0,
        });
      }
    });
    this.activatedRoute.queryParams.subscribe((res) => {
      //default
      if (res['page'] === undefined) {
        this.page = 0;
      } else {
        this.page = res['page'] - 1;
      }
      //default
      if (res['size'] === undefined) {
        this.size = 3;
        if (!this.categoryId) {
          this.getProducts({
            size: this.size,
            page: this.page,
          });
        } else {
          this.getProductByCategoryId(+this.categoryId, {
            size: this.size,
            page: this.page,
          });
        }
      } else {
        this.size = res['size'];
        if (!this.categoryId) {
          this.getProducts({
            size: this.size,
            page: this.page,
          });
        } else {
          this.getProductByCategoryId(+this.categoryId, {
            size: this.size,
            page: this.page,
          });
        }
      }

      // if (res['size'] === undefined) {
      //   if(!this.categoryId){
      //     this.getProducts({
      //       size: this.size,
      //       page: this.page,
      //     });
      //   }else{
      //   this.getProductByCategoryId(+this.categoryId,{size:this.size,page:this.page})
      //   }

      // } else {
      //   this.getProducts({
      //     ...res,
      //     page: this.page,
      //     category_id: this.categoryId,
      //   });
      // }
    });
  }

  getProducts(para: any) {
    this.isLoading = true;
    this.productService
      .getGroupProduct(para.page, para.size)
      .subscribe((resp) => {
        this.groupProducts = resp.data.content;
        this.totalPages = resp.data.totalPages;
        this.isLoading = false;
      });
  }
  getProductByCategoryId(id: number, para: any) {
    this.isLoading = true;
    this.productService
      .getGroupProductByCategoryId(id, para.page, para.size)
      .subscribe((resp) => {
        console.log(resp.data);
        this.groupProducts = resp.data.content;
        this.totalPages = resp.data.totalPages;
        this.isLoading = false;
      });
  }
  openDialogProduct(product: GroupProduct): void {
    const dialogRef = this.dialog.open(ProductPopupComponent, {
      width: '970px',
      data: product,
    });
  }
  sortBy(mode: string) {
    let value = 'Mặc định';
    switch (mode) {
      case 'AZ':
        value = 'A → Z';
        break;
      case 'ZA':
        value = 'Z → A';
        break;
      case 'increase':
        value = 'Giá tăng dần';
        break;
      case 'decrease':
        value = 'Giá giảm dần';
        break;
      case 'new':
        value = 'Hàng mới nhất';
        break;
      case 'old':
        value = 'Hàng cũ nhất';
        break;
      default:
        value = 'Mặc định';
        break;
    }

    let myContainer = document.getElementById(
      'selected-sort'
    ) as HTMLInputElement;
    myContainer.innerHTML = value;
    this.sort = mode;
  }
}
