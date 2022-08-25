import { ProductService } from './../../../service/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GroupProduct } from 'src/app/model/group-product.model';
import * as customBuild from '../../../ckeditor5Custom/build/ckeditor';
import { Image } from 'src/app/model/image.model';
import { mergeMap, forkJoin } from 'rxjs';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/model/category.model';
import { Product, ProductAdd } from 'src/app/model/product.model';
import { Size } from 'src/app/model/size.model';
interface expandedRows {
  [key: string]: boolean;
}
@Component({
  selector: 'app-group-product',
  templateUrl: './group-product.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./group-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GroupProductComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  isLoading: boolean = false;

  product: ProductAdd;
  selectedUsers: GroupProduct[] = [];
  groupProducts: GroupProduct[] = [];
  groupProduct!: GroupProduct;
  categories: Category[] = [];
  categoriesDropdown: any[];
  sizes: Size[] = [];
  sizesDropdown: any[];
  sizeSelected: Size;
  images: Image[] = [];

  isEditGroupProduct: boolean = false;

  //pagination
  public totalRecords: number = 0;
  public size: number = 5;

  //expand
  isExpanded: boolean = false;
  expandedRows: expandedRows = {};

  cols: any[] = [];

  productDialog = false;
  submitted: boolean = false;
  groupProductDialog: boolean = false;

  uploadedFiles: any[] = [];
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

  statusesProduct: any = [];
  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    //this.users.push(this.user0); this.users.push(this.user1);
    this.loadGroupProduct(0, this.size);

    this.statusesProduct = [
      { label: 'ACTIVE', value: 1 },
      { label: 'INACTIVE', value: 0 },
    ];
    this.cols = [
      { field: 'id', header: 'id' },
      { field: 'image', header: 'image' },
      { field: 'name', header: 'name' },
      { field: 'discount', header: 'discount' },
      { field: 'status', header: 'status' },
    ];
    this.categoryService.getCategoriesInAdmin(0, 50, 'Active').subscribe({
      next: (res: any) => {
        this.categories = res.content;
        this.categoriesDropdown = this.convertToLabelAndValue(this.categories);
      },
    });
    this.productService.getAllSize(0, 50).subscribe({
      next: (res: any) => {
        this.sizes = res.data.content;
        this.sizesDropdown = this.convertToLabelAndValue(this.sizes);
      },
      error: (error) => {
        alert(error.message);
      },
    });
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
          this.productService.addImage(res.data, this.groupProduct.id)
        )
      )
      .subscribe({
        next: (res) => {
          this.images = this.images.concat(res.data);
          this.getGroupProductById();
          this.messageService.add({
            severity: 'info',
            summary: 'File Uploaded',
            detail: 'Uploaded file success!',
            life: 1000,
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  openGroupProductDialog() {
    this.groupProduct = {};
    this.groupProduct.status = 1;
    this.submitted = false;
    this.groupProductDialog = true;
  }
  openProductDialog(groupProduct: GroupProduct) {
    this.product = {};
    this.product.status = 1;
    this.product.groupProductId = groupProduct.id;
    this.submitted = false;
    this.productDialog = true;
  }
  expandAll() {
    if (!this.isExpanded) {
      this.groupProducts.forEach((groupProduct) =>
        groupProduct && groupProduct.id
          ? (this.expandedRows[groupProduct.id] = true)
          : 0
      );
    } else {
      this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }
  saveProduct() {
    this.isLoading = true;
    this.submitted = true;
    if (!this.sizeSelected.id || !this.product.quantity) {
      this.isLoading = false;
      return;
    }
    if (this.product.price > 10000000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid price!',
      });
      this.isLoading = false;
      return;
    }
    if (this.product.quantity > 1000) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Wanning',
        detail: 'Please enter valid quantity!',
      });
      this.isLoading = false;
      return;
    }
    this.product.sizeId = this.sizeSelected.id;
    console.log(this.product);
    this.productService.addProduct(this.product).subscribe({
      next: (res) => {
        let indexGroupProduct = this.groupProducts.findIndex(
          (element) => element.id == this.product.groupProductId
        );

        this.groupProducts[indexGroupProduct].products.push({
          ...res.data,
        });
        this.product = {};
        this.productDialog = false;
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;

        alert(e.error.message);
      },
    });
  }
  openEditGroupProduct(groupProduct: GroupProduct) {
    this.isEditGroupProduct = true;
    this.groupProduct = {};
    this.groupProduct = groupProduct;
    //console.log(user);
    this.productService.getImagesByGroupProductId(groupProduct.id).subscribe({
      next: (response) => {
        this.images = response.data;
      },
      error: (error) => {
        alert(error.message);
      },
    });
    this.groupProductDialog = true;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  applyColumnFilter($event: any, field: any, stringVal: any) {
    this.dt.filter(($event.target as HTMLInputElement).value, field, stringVal);
  }

  confirmDelete() {
    // this.deleteUserDialog = false;
    // const status = document.getElementById("status-user-" + this.groupProduct.id);
    // //this.users = this.users.filter(val => val.id !== this.user.id);
    // const foundIndex = this.groupProducts.findIndex(element => element.id == this.groupProduct.id);
    // this.groupProducts[foundIndex].status = 0;
    // this.userService.updateDeletedStatus(this.groupProduct.id).subscribe((response: boolean) => {
    //   if (response) {
    //     if (status) status.innerHTML = '<span style="color: orangered;">Đã dừng</span>';
    //   }
    // })
    // this.groupProduct = {};
  }

  confirmDeleteSelected() {
    // this.deleteUsersDialog = false;
    // //this.products = this.products.filter(val => !this.selectedProducts.includes(val));
    // const ids: number[] = [];
    // Object.values(this.selectedUsers).forEach(val => {
    //   if (val.status == 1) {
    //     ids.push(val.id)
    //   }
    // });
    // this.userService.updateDeletedStatus(ids).subscribe((response: boolean) => {
    //   if (response) {
    //     ids.forEach(val => {
    //       const foundIndex = this.groupProducts.findIndex(element => element.id == val);
    //       this.groupProducts[foundIndex].status = 0;
    //       const status = document.getElementById("status-user-" + val);
    //       if (status) status.innerHTML = '<span style="color: orangered;">Đã dừng</span>';
    //     });
    //   }
    // })
    // this.selectedUsers = [];
  }

  hideDialog() {
    this.groupProductDialog = false;
    this.submitted = false;
    this.uploadedFiles = [];
  }

  saveGroupProduct() {
    this.submitted = true;
    this.isLoading = true;
    // this.groupProduct.products = [];
    this.productService.addGroupProduct(this.groupProduct).subscribe({
      next: (response) => {
        if (this.isEditGroupProduct) {
          this.groupProducts = this.groupProducts.map((product) =>
            product.id === response.data.id
              ? { ...product, ...response.data }
              : { ...product }
          );
        } else {
          console.log('thjem moi');
          this.groupProducts.push(response.data);
        }

        this.groupProductDialog = false;
        this.isLoading = false;
        this.isEditGroupProduct = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        alert(error.message);
      },
    });
    this.groupProductDialog = false;

    this.groupProduct = {};
  }

  loadGroupProduct(currentPage: number, size: number) {
    this.productService.getGroupProduct(currentPage, size).subscribe({
      next: (response) => {
        console.log(response.data);
        this.totalRecords = response.data.totalElements;

        this.groupProducts = response.data.content;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }
  removeImage(img: Image) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete!',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteImage(img.id).subscribe({
          next: (res) => {
            this.images = this.images.filter((img) => img.id !== res.data);
            this.getGroupProductById();
          },
        });
      },
      reject: () => {},
    });
  }
  getGroupProductById() {
    this.productService.getGroupProductById(this.groupProduct.id).subscribe({
      next: (resp) => {
        this.groupProducts = this.groupProducts.map((product) =>
          product.id === resp.data.id ? { ...resp.data } : { ...product }
        );
      },
    });
  }
  onUpdateStatusGroupProduct(groupProduct, status) {
    let groupProductId = this.groupProducts.findIndex(
      (obj) => obj.id == groupProduct.id
    );
    if (this.groupProducts[groupProductId].status !== status) {
      this.productService
        .updateStatusGroupProductById(groupProduct.id, status)
        .subscribe({
          next: (response: any) => {
            this.groupProducts[groupProductId].status = status;
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Group product was inactive',
              life: 2000,
            });
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
              life: 2000,
            });
            console.log('Inactive group product : ' + error.message);
          },
        });
    }
  }
  convertSizeIdToName(sizeId: number) {
    return this.sizes.filter((size) => size.id == sizeId)[0].name;
  }

  convertToLabelAndValue(sourceList: any[]): any[] {
    return sourceList.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }

  onPageChange(event: any) {
    this.loadGroupProduct(event.page, event.rows);
  }
  onReady(editor) {
    if (editor.model.schema.isRegistered('image')) {
      editor.model.schema.extend('image', { allowAttributes: 'blockIndent' });
    }
  }
}
