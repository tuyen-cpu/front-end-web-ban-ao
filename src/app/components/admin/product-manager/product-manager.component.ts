import { GroupProduct } from './../../../model/group-product.model';
import { Category } from 'src/app/model/category.model';
import { Image } from './../../../model/image.model';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Product, ProductAdd } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Pagination } from 'src/app/model/pagination.model';
import { Table } from 'primeng/table';
import * as customBuild from '../../../ckeditor5Custom/build/ckeditor';
import { forkJoin, mergeMap, Subscription } from 'rxjs';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./product-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductManagerComponent implements OnInit, OnDestroy {
  products!: Product[];
  product!: ProductAdd;
  categorySelected: Category;
  groupProductSelected: GroupProduct;
  categories: Category[] = [];
  groupProducts: GroupProduct[];
  productEdit: ProductAdd = {
    name: '',
    longDescription: 'Enter here!',
    price: 0,
    quantity: 0,
    discount: 0,
    status: 1,
    groupProductId: 1,
  };
  isLoading: boolean = false;
  statuses!: any[];
  images: Image[] = [];
  cols!: any[];
  @ViewChild('dt') dt!: Table;
  private imageSub: Subscription = new Subscription();
  productDialog!: boolean;
  productDialogEdit!: boolean;
  uploadedFiles: any[] = [];
  submitted!: boolean;
  editSubmitted!: boolean;
  public Editor = customBuild;
  data: string = '<p>Enter description here!</p>';
  config = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'insertTable',
        'alignment',
        'bulletedList',
        'numberedList',
        'blockQuote',
        'uploadImage',
      ],
      shouldNotGroupWhenFull: true,
    },
    alignment: {
      options: ['left', 'center', 'justify', 'right'],
    },
    image: {
      style: ['alignLeft', 'alignCenter', 'alignRight'],
      resizeUnit: '%',
      resizeOptions: [
        {
          name: 'imageResize:original',
          value: null,
          icon: 'original',
        },
        {
          name: 'imageResize:10',
          value: '10',
          icon: 'medium',
        },
        {
          name: 'imageResize:50',
          value: '50',
          icon: 'medium',
        },
        {
          name: 'imageResize:75',
          value: '75',
          icon: 'large',
        },
      ],
      toolbar: [
        'imageResize',
        'imageResize:10',
        'imageResize:original',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        'imageStyle:alignLeft',
        'imageStyle:alignRight',
        'imageStyle:alignCenter',
        '|',
        '|',
        'imageTextAlternative',
      ],
    },
  };
  onReady(editor) {
    if (editor.model.schema.isRegistered('image')) {
      editor.model.schema.extend('image', { allowAttributes: 'blockIndent' });
    }
  }
  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    var fd = new FormData();
    for (let file of event.files) {
      fd.append('file', file);
    }
    this.productService
      .uploadFileImage(fd)
      .pipe(
        mergeMap((res) =>
          this.productService.addImage(res, this.productEdit.id)
        )
      )
      .subscribe((resp) => {
        console.log('Add image success!');
      });
    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: 'Uploaded file success!',
    });
  }
  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.productService
      .getProductsManager('', 0, 30)
      .subscribe((res: Pagination) => {
        this.products = res.products;
        console.log(this.products);
      });

    this.statuses = [
      { label: 'INSTOCK', value: 1 },
      { label: 'OUTOFSTOCK', value: 0 },
    ];
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'NAME' },
      { field: 'price', header: 'PRICE' },
      { field: 'quantity', header: 'QUANTITY' },
      { field: 'discount', header: 'DISCOUNT' },
      { field: 'status', header: 'STATUS' },
    ];
    this.categoryService.getCategoriesInAdmin(0, 5).subscribe({
      next: (res: any) => {
        this.categories = res.content;
        console.log(res.content);
      },
    });
    this.productService.getGroupProduct().subscribe({
      next: (res: any) => {
        this.groupProducts = res;
      },
    });
  }
  blur() {
    console.log('blur');
  }
  onSelectionChanged() {
    console.log('selection changed');
  }
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
  hideDialogEdit() {
    this.productDialogEdit = false;
    this.imageSub.unsubscribe();
    this.uploadedFiles = [];
  }
  saveProduct() {
    this.product = {
      ...this.product,
      name: this.groupProductSelected.name,
      categoryId: this.categorySelected.id,
      groupProductId: this.groupProductSelected.id,
    };

    this.isLoading = true;
    this.submitted = true;
    if (
      !this.product.name ||
      this.product.price == 0 ||
      !this.product.quantity
    ) {
      this.isLoading = false;
      return;
    }
    if (this.product.price > 500000000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid price!',
      });
      return;
    }
    if (this.product.quantity > 10000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid quantity!',
      });
      return;
    }
    if (this.product.discount > 1000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid discount!',
      });
      return;
    }

    console.log(this.product);
    this.productService.addProduct(this.product).subscribe({
      next: (res) => {
        console.log(res);
        this.products.push({ ...res, name: this.product.name });
        this.productDialog = false;
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        alert(e.error.message);
      },
    });

    this.data = '<p>Enter description here!</p>';
    this.imageSub.unsubscribe();
  }
  removeImage(img: Image) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete!',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteImage(img.id).subscribe((res) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Dialog',
            detail: 'Delete image success!',
          });
        });
      },
      reject: () => {},
    });
  }
  deleteSelectedProducts() {}
  saveProductEdit() {
    this.isLoading = true;
    this.editSubmitted = true;
    if (
      !this.productEdit.name ||
      this.productEdit.price == 0 ||
      !this.productEdit.quantity
    ) {
      this.isLoading = false;
      return;
    }
    if (this.productEdit.price > 500000000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid price!',
      });
      return;
    }
    if (this.productEdit.quantity > 10000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid quantity!',
      });
      return;
    }
    if (this.productEdit.discount > 1000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid discount!',
      });
      return;
    }

    this.productService.updateProduct(this.productEdit).subscribe({
      next: (res) => {
        this.products = this.products.map((product) =>
          product.id === res.id ? { ...product, ...res } : product
        );
        this.isLoading = false;
        this.productDialogEdit = false;
        this.productEdit = {};
      },
      error: (e) => {
        this.isLoading = false;
        alert(e.error.message);
      },
    });
    this.uploadedFiles = [];
  }
  editProduct(product: ProductAdd) {
    this.editSubmitted = false;
    this.productService.resetImages();

    this.productService.getLongDescriptionById(product.id).subscribe((res) => {
      this.productEdit = {
        ...product,
        longDescription: res,
      };
    });

    this.productService.getImagesProduct(product.id).subscribe((res) => {});
    this.imageSub = this.productService.imageChanged.subscribe((res) => {
      this.images = res;
    });
    this.productDialogEdit = true;
  }

  deleteProduct(product: Product) {}
  ngOnDestroy(): void {}
}
