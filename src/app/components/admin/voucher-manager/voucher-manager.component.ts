import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Voucher } from 'src/app/model/voucher.model';
import { VoucherService } from 'src/app/service/voucher.service';
@Component({
  selector: 'app-voucher-manager',
  templateUrl: './voucher-manager.component.html',
  styleUrls: ['./voucher-manager.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class VoucherManagerComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  selectedVouchers: Voucher[] = [];
  vouchers: Voucher[] = [];
  voucher!: any;
  today = new Date();

  //pagination
  public totalRecords: number = 0;
  public currentPage: number = 0;
  public size: number = 5;

  public cols: any[] = [];
  public listStatuses: SelectItem[] = [];
  public selectedStatus: number = 0;

  public submitted: boolean = false;
  public voucherDialog: boolean = false;

  existedCode  = false;
  isLoading = false;

  constructor(
    private voucherService: VoucherService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.initColumnsTable();
    this.loadVouchers(0, 5);
    this.initListStatus();
  }

  public loadVouchers(currentPage: number, size: number) {
    this.voucherService.getVouchersInAdmin(currentPage, size).subscribe({
      next: (response: any) => {
        //console.log(response)
        this.vouchers = response?.content;
        this.currentPage = response?.number;
        this.totalRecords = response?.totalElements;
        this.size = response?.size;
      },
      error: (error: HttpErrorResponse) => {
        console.log("List comment : " + error.message);
      }
    });
  }

  initListStatus() {
    this.listStatuses = [
      { label: 'Hoạt động', value: 1 },
      { label: 'Đã hủy', value: 0 }
    ]
  }

  initColumnsTable() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'code', header: 'Code' },
      { field: 'cost', header: 'Cost' },
      { field: 'startedDate', header: 'Started date' },
      { field: 'endedDate', header: 'Ended date' },
      { field: 'status', header: 'Status' },
      { field: 'billIds', header: 'Bill Ids' },
      { field: 'time', header: 'Times' },
    ];
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  applyColumnFilter($event: any, field: any, stringVal: any) {
    this.dt.filter(($event.target as HTMLInputElement).value, field, stringVal);
  }

  public onPageChange(event: any) {
    this.loadVouchers(event.page, event.rows)
  }

  inactiveVoucher(voucher){
    this.voucherService.updateStatus(voucher.id, 0).subscribe({
      next: (response: any) => {
        const updatedCommentId = this.vouchers.findIndex((obj => obj.id == voucher.id));
        this.vouchers[updatedCommentId].status = 0;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Voucher was inactive', life: 3000 });
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The process errors', life: 3000 });
        console.log("Inactive voucher : " + error.message);
      }
    });
  }
  
  activeVoucher(voucher){
    this.voucherService.updateStatus(voucher.id, 1).subscribe({
      next: (response: any) => {
        const updatedCommentId = this.vouchers.findIndex((obj => obj.id == voucher.id));
        this.vouchers[updatedCommentId].status = 1;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Voucher was active', life: 3000 });
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The process errors', life: 3000 });
        console.log("Active voucher : " + error.message);
      }
    });
  }
  
  inactiveSelectedVouchers(){
    let ids = this.selectedVouchers.map((obj) => obj.id);

    this.voucherService.updateStatus(ids, 0).subscribe({
      next: (response: any) => {
        for (const id of ids) {
          const updatedCommentId = this.vouchers.findIndex((obj => obj.id == id));
          this.vouchers[updatedCommentId].status = 0;
        }
        this.selectedVouchers = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Vouchers was inactive', life: 3000 });
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The process errors', life: 3000 });
        console.log("Inactive vouchers : " + error.message);
      }
    });
  }

  openNew() {
    const newVoucher:Voucher={
      id: 0,
      code: '',
      cost: 0,
      startedDate: new  Date,
      endedDate: new Date,
      status: 0,
      billIds: [],
      time:0
    }
    this.voucher=newVoucher;
    this.submitted = false;
    this.voucherDialog = true;
  }

  existsCode(code:string){
    this.voucherService.existsVoucher(code).subscribe({
      next: (response: boolean) => {
        const value:boolean  = response;
        if (value == true) {
          this.existedCode = true;
        } else {
          this.existedCode = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log("Check voucher code : " + error.message);
      }
    });
  }

  hideDialog(){
    this.voucherDialog = false;
    this.submitted = false;
  }

  saveVoucher(){
    this.isLoading = true;
    this.submitted = true;
    if (!this.voucher.status) {
      this.voucher.status = 1;
    }
    if (this.voucher.id && this.voucher.id > 0 ) {
      this.vouchers = this.vouchers.filter(val => val.id !== this.voucher.id);
    }
    this.voucherService.saveVoucher(this.voucher).subscribe({
      next: (response: Voucher) => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Voucher saved', life: 3000 });
        this.voucher = response;
        this.vouchers.unshift(this.voucher);
        this.isLoading = false;
        this.voucherDialog = false;
        this.voucher = {};
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.voucherDialog = false;
        this.voucher = {};
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The process errors', life: 3000 });
        console.log("Saving voucher : " + error.message);
      }
    });
  }
  editVoucher(voucher){
    voucher.startedDate = this.formatDate(voucher.startedDate);
    voucher.endedDate = this.formatDate(voucher.endedDate);
    this.voucher=voucher;
    this.voucherDialog=true;
  }

  formatDate(date:any):Date{
    if(date!=null&&date!=''){
      return new Date(date);
    }else{
      return new Date();
    }
  }
}
