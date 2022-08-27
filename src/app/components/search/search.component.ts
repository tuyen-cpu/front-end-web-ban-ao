import { GroupProduct } from './../../model/group-product.model';
import { ProductService } from './../../service/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'src/app/model/pagination.model';
import { Product } from 'src/app/model/product.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  keySearch!: string | null;
  currentPage: number = 1;
  size: number = 10;
  totalPages!: number;
  groupProducts: GroupProduct[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log('rrrr');
    this.getParamsUrl();
  }
  getParamsUrl() {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.keySearch = res['query'];
      if (res['currentPage'] === undefined) {
        this.currentPage = 0;
      } else {
        this.currentPage = res['currentPage'] - 1;
      }
      if (res['size'] === undefined) {
        this.size = 10;
      } else {
        this.size = res['size'];
      }
      this.getProducts(this.keySearch, this.currentPage, this.size);
    });
  }
  getProducts(keySearch: string | null, currentPage: number, size: number) {
    this.productService
      .searchGroupProduct(keySearch, currentPage, size)
      .subscribe((res) => {
        this.groupProducts = res.data.content;
        this.totalPages = res.data.totalPages;
        console.log(res);
        console.log(this.groupProducts);
      });
  }
  onPageChange(event: any) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        currentPage: event['page'] + 1,
        size: this.size,
      },
      queryParamsHandling: 'merge',
    });
  }
}
