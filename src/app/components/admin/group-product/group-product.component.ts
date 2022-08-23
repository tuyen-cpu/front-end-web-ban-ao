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
@Component({
  selector: 'app-group-product',
  templateUrl: './group-product.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./group-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GroupProductComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  selectedUsers: GroupProduct[] = [];
  groupProducts: GroupProduct[] = [];
  groupProduct!: GroupProduct;
  isLoading: boolean = false;
  public deleteUserDialog: boolean = false;
  public deleteUsersDialog: boolean = false;

  //pagination
  public totalRecords: number = 0;
  public currentPage: number = 0;
  public size: number = 5;

  isEditGroupProduct: boolean = false;
  images: Image[] = [];
  cols: any[] = [];
  submitted: boolean = false;
  groupProductDialog: boolean = false;
  listStatuses: SelectItem[] = [];

  categories: Category[] = [];
  categoriesDropdown: any[];

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
  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    //this.users.push(this.user0); this.users.push(this.user1);
    this.loadGroupProduct(0, this.size);

    this.listStatuses = [
      { label: 'Hoạt động', value: '1' },
      { label: 'Đã dừng', value: '0' },
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
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  openNew() {
    this.groupProduct = {};
    this.groupProduct.status = 1;
    this.submitted = false;
    this.groupProductDialog = true;
  }

  deleteSelectedUsers() {
    this.deleteUsersDialog = true;
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

  deleteUser(user: any) {
    this.deleteUserDialog = true;
    this.groupProduct = user;
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
    this.productService.addGroupProduct(this.groupProduct).subscribe({
      next: (response) => {
        console.log(this.isEditGroupProduct);
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
        alert(error.message);
      },
    });
    this.groupProductDialog = false;

    this.groupProduct = {};
  }

  loadGroupProduct(currentPage: number, size: number) {
    this.productService.getGroupProduct(currentPage, size).subscribe({
      next: (response) => {
        this.currentPage = response.data.number;
        this.totalRecords = response.data.totalElements;
        this.size = response.data.size;
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
