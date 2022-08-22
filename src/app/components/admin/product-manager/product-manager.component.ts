import { Size } from './../../../model/size.model';
import { GroupProduct } from './../../../model/group-product.model';
import { Category } from 'src/app/model/category.model';
import { Image } from './../../../model/image.model';
import {
  Component,
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
  categoriesDropdown: any[];

  groupProducts: GroupProduct[];
  groupProductsDropdown: any[];

  sizes: Size[] = [];
  sizesDropdown: any[];

  sizeSelected: Size;
  productEdit: ProductAdd;
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
          this.productService.addImage(res.data, this.productEdit.id)
        )
      )
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'info',
            summary: 'File Uploaded',
            detail: 'Uploaded file success!',
          });
        },
        error: (error) => {
          console.log(error);
        },
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
      .getProductsManager('', 0, 50)
      .subscribe((res: Pagination) => {
        this.products = res.products;
        console.log(this.products);
      });
    this.productService.getAllSize(0, 50).subscribe({
      next: (res: any) => {
        this.sizes = res.content;
        this.sizesDropdown = this.convertToLabelAndValue(this.sizes);
      },
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
    this.categoryService.getCategoriesInAdmin(0, 50, 'Active').subscribe({
      next: (res: any) => {
        this.categories = res.content;
        this.categoriesDropdown = this.convertToLabelAndValue(this.categories);
      },
    });
    this.productService.getGroupProduct().subscribe({
      next: (res: any) => {
        this.groupProducts = res;
        this.groupProductsDropdown = this.convertToLabelAndValue(
          this.groupProducts
        );
      },
    });
  }
  convertToLabelAndValue(sourceList: any[]): any[] {
    return sourceList.map((item) => ({
      label: item.name,
      value: item.id,
    }));
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
    console.log('save');
    this.isLoading = true;
    this.submitted = true;
    if (
      !this.categorySelected ||
      !this.sizeSelected ||
      !this.groupProductSelected ||
      this.product.price == 0 ||
      !this.product.quantity
    ) {
      this.isLoading = false;
      console.log();
      console.log('what');
      return;
    }
    if (this.product.price > 500000000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid price!',
      });
      console.log('what');
      return;
    }
    if (this.product.quantity > 10000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid quantity!',
      });
      console.log('what');
      return;
    }
    if (this.product.discount > 1000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid discount!',
      });
      console.log('what');
      return;
    }
    this.product = {
      ...this.product,
      sizeId: this.sizeSelected.id,
      name: this.groupProductSelected.name,
      categoryId: this.categorySelected.id,
      groupProductId: this.groupProductSelected.id,
    };
    console.log(this.product);
    this.productService.addProduct(this.product).subscribe({
      next: (res) => {
        console.log(res);
        this.products.push({
          ...res.data,
          name: this.product.name,
          sizeName: this.sizeSelected.name,
        });
        this.sizeSelected = {};
        this.categorySelected = {};
        this.groupProductSelected = {};
        this.productDialog = false;
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        console.log(e);
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
      !this.productEdit.categoryId ||
      !this.productEdit.sizeId ||
      !this.productEdit.groupProductId ||
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
          product.id === res.data.id ? { ...product, ...res.data } : product
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
  openEditProduct(product: ProductAdd) {
    console.log(product);
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
