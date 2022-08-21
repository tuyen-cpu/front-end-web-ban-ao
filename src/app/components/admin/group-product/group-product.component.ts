import { ProductService } from './../../../service/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { GroupProduct } from 'src/app/model/group-product.model';

@Component({
  selector: 'app-group-product',
  templateUrl: './group-product.component.html',
  styleUrls: ['./group-product.component.scss'],
})
export class GroupProductComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  selectedUsers: GroupProduct[] = [];
  groupProducts: GroupProduct[] = [];
  groupProduct!: GroupProduct;
  isLoading: boolean = false;
  public deleteUserDialog: boolean = false;
  public deleteUsersDialog: boolean = false;

  genders: SelectItem[] = [];
  today = new Date();

  //pagination
  public totalRecords: number = 0;
  public currentPage: number = 0;
  public size: number = 5;

  cols: any[] = [];
  submitted: boolean = false;
  groupProductDialog: boolean = false;
  listStatuses: SelectItem[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    //this.users.push(this.user0); this.users.push(this.user1);
    this.loadUsers(0, 5);

    this.listStatuses = [
      { label: 'Hoạt động', value: '1' },
      { label: 'Đã dừng', value: '0' },
    ];
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'name', header: 'name' },
    ];

    this.genders = [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 0 },
      { label: 'Other', value: 2 },
    ];
  }

  creatDate(birthday: any): Date {
    return new Date(birthday);
  }
  openNew() {
    this.groupProduct = {};
    this.submitted = false;
    this.groupProductDialog = true;
  }

  deleteSelectedUsers() {
    this.deleteUsersDialog = true;
  }

  editUser(user: any) {
    this.groupProduct = {};
    this.groupProduct = user;
    //console.log(user);

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
  }

  public saveUser() {
    this.submitted = true;
    this.isLoading = true;
    this.productService.addGroupProduct(this.groupProduct).subscribe({
      next: (response: any) => {
        this.groupProducts.push(response);
        this.groupProductDialog = false;
        this.isLoading = false;
      },
    });
    this.groupProductDialog = false;
    this.groupProduct = {};
  }

  public loadUsers(currentPage: number, size: number) {
    this.productService.getGroupProduct().subscribe({
      next: (response: any) => {
        this.groupProducts = response;
      },
      error: (error: HttpErrorResponse) => {
        console.log('231: ' + error.message);
      },
    });
  }

  public onPageChange(event: any) {
    this.loadUsers(event.page, event.rows);
  }
}
