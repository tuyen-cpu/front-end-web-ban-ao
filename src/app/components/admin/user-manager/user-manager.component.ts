import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  selectedUsers: User[] = [];
  users: User[] = [];
  user!: any;

  public deleteUserDialog: boolean = false;
  public deleteUsersDialog: boolean = false;

  genders: SelectItem[] = [];
  today = new Date();
  selectedRoles: any[] = [];

  //pagination
  public totalRecords: number = 0;
  public currentPage: number = 0;
  public size: number = 5;

  cols: any[] = [];
  submitted: boolean = false;
  userDialog: boolean = false;
  listRoles: any[] = [];
  listStatuses: SelectItem[] = [];
  existUsername: boolean = false;
  existEmail: boolean = false;
  invalidPwd: boolean = false;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    //this.users.push(this.user0); this.users.push(this.user1);
    this.loadUsers(0, 5);
    this.listRoles = [
      { label: 'Admin', value: 'admin' },
      { label: 'Client', value: 'client' }
    ];
    this.listStatuses = [
      { label: 'Hoạt động', value: '1' },
      { label: 'Đã dừng', value: '0' }
    ]
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'username', header: 'Username' },
      { field: 'email', header: 'Email' },
      { field: 'status', header: 'Status' },
      { field: 'role', header: 'role' },
      { field: 'numBills', header: 'numBills' },
      { field: 'numComments', header: 'numComments' },
      { field: 'numAddresses', header: 'numAddresses' }
    ];

    this.genders = [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 0 },
      { label: 'Other', value: 2 }
    ];
  }

  creatDate(birthday: any): Date {
    return new Date(birthday);
  }
  openNew() {
    this.selectedRoles = [];
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    this.deleteUsersDialog = true;
  }

  editUser(user: any) {
    this.selectedRoles = [];
    this.user = {};
    this.user = user;
    //console.log(user);
    if(this.user.birthday!=null){
      this.user.birthday = this.creatDate(this.user.birthday);
    }
    Object.values(this.user.roles).forEach(item => {
      if (item == 'client' && !this.selectedRoles.includes(this.listRoles[0])) {
        this.selectedRoles.push(this.listRoles[1]);
      } else
        if (item == 'admin' && !this.selectedRoles.includes(this.listRoles[1])) {
          this.selectedRoles.push(this.listRoles[0]);
        }
    })
    this.user.status = this.user.status + '';
    this.userDialog = true;
  }

  deleteUser(user: any) {
    this.deleteUserDialog = true;
    this.user = user;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  applyColumnFilter($event: any, field: any, stringVal: any) {
    this.dt.filter(($event.target as HTMLInputElement).value, field, stringVal);
  }

  confirmDelete() {
    this.deleteUserDialog = false;
    const status = document.getElementById("status-user-" + this.user.id);
    //this.users = this.users.filter(val => val.id !== this.user.id);
    const foundIndex = this.users.findIndex(element => element.id == this.user.id);
    this.users[foundIndex].status = 0;
    this.userService.updateDeletedStatus(this.user.id).subscribe((response: boolean) => {
      if (response) {
        if (status) status.innerHTML = '<span style="color: orangered;">Đã dừng</span>';
      }
    })
    this.user = {};
  }

  confirmDeleteSelected() {
    this.deleteUsersDialog = false;
    //this.products = this.products.filter(val => !this.selectedProducts.includes(val));
    const ids: number[] = [];

    Object.values(this.selectedUsers).forEach(val => {
      if (val.status == 1) {
        ids.push(val.id)
      }
    });
    this.userService.updateDeletedStatus(ids).subscribe((response: boolean) => {
      if (response) {
        ids.forEach(val => {
          const foundIndex = this.users.findIndex(element => element.id == val);
          this.users[foundIndex].status = 0;
          const status = document.getElementById("status-user-" + val);
          if (status) status.innerHTML = '<span style="color: orangered;">Đã dừng</span>';
        });
      }
    })
    this.selectedUsers = [];
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  public saveUser() {
    this.submitted = true;
    this.user.roles = [];
    if (!this.user.status) {
      this.user.status = 1;
    }

    Object.values(this.selectedRoles).forEach(item => {
      this.user.roles.push(item.value);
    })

    if (this.user.roles.length == 0) {
      this.user.roles.push("client");
    }
    if (this.user.id) {
      this.users = this.users.filter(val => val.id !== this.user.id);
    }
    this.userService.newUser(this.user).subscribe((response: User) => {
      //console.log(response.birthday + "....")
      response.numAddresses = 0;
      response.numBills = 0;
      response.numComments = 0;
      this.users.unshift(response)
    })
    this.userDialog = false;
    this.user = {};
  }

  public checkUsername(name: string) {
    let value: Boolean = false;
    this.userService.existsUsername(name).subscribe(
      (response: Boolean) => {
        value = response;
        if (value == true) {
          this.existUsername = true;
        } else {
          this.existUsername = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      });
  }

  public checkEmail(email: string) {
    let value: Boolean = false;
    this.userService.existsEmail(email).subscribe(
      (response: Boolean) => {
        value = response;
        if (value == true) {
          this.existEmail = true;
        } else {
          this.existEmail = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      });
  }

  public checkPwd(pwd: string) {
    if (pwd.length < 6) {
      this.invalidPwd = true;
    } else {
      this.invalidPwd = false;
    }
  }

  public loadUsers(currentPage: number, size: number) {
    this.userService.getUsersInAdmin(currentPage, size).subscribe({
      next: (response: any) => {
        this.users = response?.content;
        this.currentPage = response?.number;
        this.totalRecords = response?.totalElements;
        this.size = response?.size;
      },
      error: (error: HttpErrorResponse) => {
        console.log("List user : " + error.message);
      }
    });
  }

  public onPageChange(event: any) {
    this.loadUsers(event.page, event.rows)
  }

}
