import { CategoryService } from 'src/app/service/category.service';
import { GroupProduct } from './../../model/group-product.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from './../../service/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/service/storage.service';
import { AuthService } from 'src/app/service/auth.service';
import { CartItem } from 'src/app/model/cart-item.model';
import { CartService } from 'src/app/service/cart.service';
import { Category } from 'src/app/model/category.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;
  //user login
  currentUser: any;
  private mqAlias = '';
  public showMenu = false;
  private mediaSub: Subscription = new Subscription();

  categories: Category[];
  //changed key search
  private subjectKeyup = new Subject<any>();
  //list group product when search
  groupProducts: GroupProduct[] = [];
  //key input when search
  keySearch: string = '';
  //check is loading
  isLoading = false;
  //quantity show when search
  limitedQuantity: number = 5;
  searchForm!: FormGroup;

  isAdmin = false;

  //cart
  public cartItems: CartItem[] = [];
  totalQuantity: number = 0;
  public totalCart: number = 0;
  constructor(
    private cdRef: ChangeDetectorRef,
    private mediaObserver: MediaObserver,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    //load product when stop input
    this.subjectKeyup.pipe(debounceTime(900)).subscribe((key) => {
      this.isLoading = false;
      this.searchProducts(key);
    });

    this.mediaSub = this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        this.mqAlias = change.mqAlias;
      }
    );
    this.getCategory();
    this.initForm();

    //get user login
    //this.currentUser = this.storageService.getUser();
    this.storageService.currentUser.subscribe((data) => {
      this.currentUser = data;
    });

    //load cart Items
    this.loadListCartItem();

    this.loadIsAdmin();
  }

  public loadIsAdmin() {
    this.isAdmin = this.storageService.isAdmin();
  }

  public loadListCartItem() {
    this.cartService.getCart().subscribe((res) => {
      this.cartItems = res;
      console.log(res);
      this.totalQuantity = this.cartItems.reduce(
        (previousValue, currentValue) => previousValue + currentValue.quantity,
        0
      );
      this.totalCart = this.cartItems.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.quantity * currentValue.price,
        0
      );
    });
  }

  searchProducts(key: string) {
    this.productService
      .searchGroupProduct(key, 0, this.limitedQuantity)
      // .pipe(map((x) => x.slice(0, this.limitedQuantity)))
      .subscribe((res) => {
        this.groupProducts = res.data.content;
      });
  }

  /*
  Validate variable
  if value of variable is null,
  empty and has blank spaces
  */
  hasBlankSpaces(str: string) {
    return str === null || str.match(/^ *$/) !== null;
  }

  /*
  Handle when enter input
  */
  onSearch(event: any) {
    const value = event.target.value;
    if (this.hasBlankSpaces(value)) {
      this.groupProducts = [];
      this.isLoading = false;
      this.searchInput.nativeElement.classList.remove('open');
      return;
    }
    this.searchInput.nativeElement.classList.add('open');
    this.isLoading = true;
    this.keySearch = value;
    this.subjectKeyup.next(value);
  }

  goSearchProducts() {
    this.router.navigate(['/search'], {
      queryParams: { query: this.keySearch },
    });
  }

  onSubmit() {
    if (!this.searchForm.valid) return;
    this.goSearchProducts();
  }

  initForm() {
    this.searchForm = new FormGroup({
      inputSearch: new FormControl('', Validators.required),
    });
  }
  public getCategory(): void {
    this.categoryService.getAll().subscribe(
      (response) => {
        this.categories = response.data;
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.mediaSub) {
      this.mediaSub.unsubscribe();
    }
    this.subjectKeyup.unsubscribe();
  }

  public toggleMenuMobile(): void {
    if (this.mqAlias === 'xs' || this.mqAlias === 'sm') {
      this.showMenu = !this.showMenu;
      console.log('menu mobile');
    }
  }

  public showMenuNav(): void {
    document
      .getElementById('mySidenav')
      ?.setAttribute('style', 'visibility: visible;');
    document
      .getElementById('bg-nav')
      ?.setAttribute('style', 'visibility: visible;');
  }
  public hiddenMenuNav(): void {
    document
      .getElementById('mySidenav')
      ?.setAttribute('style', 'visibility: hidden;');
    document
      .getElementById('bg-nav')
      ?.setAttribute('style', 'visibility: hidden;');
  }

  public logout(): void {
    this.isAdmin = false;
    this.authService.logout().subscribe({
      next: (res) => {
        this.storageService.clean();
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err);
      },
    });

    //window.location.reload();
    //this.router.navigate(['/']);
  }

  /*
   * manipulate with cart mini
   */
  public deleteCartItem(id: number) {
    this.cartService.removeCartItem(id);
  }

  updateQuantity(ele: any, id: number): void {
    let quantity = ele.value;
    this.cartService.updateCartItem(id, quantity);
    this.productService.getQuantityProductById(id).subscribe({
      next: (res) => {
        if (res < quantity) {
          const msg = document.getElementById(
            'msg-quantity-' + id
          ) as HTMLDivElement | null;
          if (msg) {
            msg.setAttribute('style', 'display: block;');
            setTimeout(function () {
              msg.setAttribute('style', 'display: none;');
            }, 3000);
          }
          ele.value = res;
        }
      },
    });
  }

  decreaseQuantity(e: any, id: number): void {
    e.value = --e.value;
    if (e.value <= 0) {
      e.value = 1;
    }
    let quantity = +e.value;
    this.cartService.updateCartItem(id, quantity);
  }

  increaseQuantity(e: any, id: number): void {
    e.value = ++e.value;
    let quantity = +e.value;
    this.cartService.updateCartItem(id, quantity);
    this.productService.getQuantityProductById(id).subscribe({
      next: (res) => {
        if (res < quantity) {
          const msg = document.getElementById(
            'msg-quantity-' + id
          ) as HTMLDivElement | null;
          if (msg) {
            msg.setAttribute('style', 'display: block;');
            setTimeout(function () {
              msg.setAttribute('style', 'display: none;');
            }, 3000);
          }
          e.value = res;
        }
      },
    });
  }
}
