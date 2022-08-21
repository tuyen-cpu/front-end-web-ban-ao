import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { DetailBill } from 'src/app/model/detail-bill.model';
import { BillService } from 'src/app/shared/bills.service';

@Component({
  selector: 'app-bill-manager',
  templateUrl: './bill-manager.component.html',
  styleUrls: ['./bill-manager.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class BillManagerComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  selectedBills: DetailBill[] = [];
  bills: DetailBill[] = [];
  bill!: any;

  public deleteBillDialog: boolean = false;
  public deleteBillsDialog: boolean = false;

  //pagination
  public totalRecords: number = 0;
  public currentPage: number = 0;
  public size: number = 5;

  public cols: any[] = [];
  public listStatuses:SelectItem[] = [];
  public selectedStatus:number = 0;

  public billDialog: boolean = false;
  public isLoading = false;

  constructor(
    private billService: BillService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.initColumnsTable();
    this.loadBills(0,5);
    this.initListStatus();
  }

  initColumnsTable(){
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'fullname', header: 'Fullname' },
      { field: 'phone', header: 'Phone' },
      { field: 'address', header: 'Address' },
      { field: 'updatedDate', header: 'Updated date' },
      { field: 'voucherCost', header: 'Voucher cost' },
      { field: 'total', header: 'Total' },
      { field: 'status', header: 'Status' }
    ];
  }

  initListStatus(){
    this.listStatuses = [
      { label: 'Đang giao', value: 0 },
      { label: 'Đã giao', value: 1 },
      { label: 'Đã hủy', value: 2 }
    ]
  }

  deleteSelectedBills() {
    this.deleteBillsDialog = true;
  }

  editBill(bill: any) {
    this.bill=bill;
    this.selectedStatus=this.bill.status;
    this.billService.getBillsById(this.bill.id).subscribe({
      next: (response: DetailBill) => {
        this.bill=response;
        this.billDialog = true;
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({severity:'fail', summary: 'Fail', detail: 'Opening detail bill errors', life: 3000});
        console.log("Update Cancelled Status: " + error.message);
      }
    });
  }

  deleteBill(bill: any) {
    this.deleteBillDialog = true;
    this.bill = bill;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  applyColumnFilter($event: any, field: any, stringVal: any) {
    this.dt.filter(($event.target as HTMLInputElement).value, field, stringVal);
  }

  confirmDelete() {
    this.deleteBillDialog = false;
    
    this.billService.updateCancelledStatus(this.bill.id).subscribe({
      next: (response: boolean) => {
        if(response){
          const updatedBill = this.bills.findIndex((obj => obj.id == this.bill.id));
          this.bills[updatedBill].status = 2;//đã hủy
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Bill number '+this.bill.id+' cancelled', life: 3000});
          this.bill = {};
        }else{
          this.messageService.add({severity:'error', summary: 'Error', detail: 'The process errors', life: 3000});
          this.bill = {};
        }
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({severity:'fail', summary: 'Fail', detail: 'Bill number '+this.bill.id+' cancelled', life: 3000});
        console.log("Update Cancelled Status: " + error.message);
      }
    });
  }

  confirmDeleteSelected() {
    this.deleteBillsDialog = false;
    const ids: number[] = [];
    Object.values(this.selectedBills).forEach(val => {
      if (val.status != 2) {
        ids.push(val.id)
      }
    });

    this.billService.updateCancelledStatus(ids).subscribe({
      next: (response: boolean) => {
        if(response){
          for (const id of ids) {
            const updatedBill = this.bills.findIndex((obj => obj.id == id));
            this.bills[updatedBill].status = 2;//đã hủy
          }
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Bills cancelled', life: 3000});
          this.selectedBills = [];
        }else{
          this.messageService.add({severity:'error', summary: 'Error', detail: 'The process errors', life: 3000});
          this.selectedBills = [];
        }
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'The process errors', life: 3000});
        console.log("Update Cancelled Status: " + error.message);
      }
    });
  }

  hideDialog() {
    this.billDialog = false;
    this.bill = {};
  }

  public saveBill() {
    this.isLoading= true;
    this.billDialog = false;
    this.billService.updateStatus(this.bill.id, this.selectedStatus).subscribe({
      next: (response: boolean) => {
        if(response){
          const updatedBill = this.bills.findIndex((obj => obj.id == this.bill.id));
          this.bills[updatedBill].status = this.selectedStatus;
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Status bill updated', life: 3000});
          this.bill={};
          this.isLoading= false;
        }else{
          this.messageService.add({severity:'error', summary: 'Error', detail: 'The process errors', life: 3000});
          this.bill={};
          this.isLoading= false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading= false;
        this.messageService.add({severity:'error', summary: 'Error', detail: 'The process errors', life: 3000});
        console.log("Update Status: " + error.message);
      }
    });
  }

  public loadBills(currentPage: number, size: number) {
    this.billService.getBillsInAdmin(currentPage, size).subscribe({
      next: (response: any) => {
        //console.log(response)
        this.bills = response?.content;
        this.currentPage = response?.number;
        this.totalRecords = response?.totalElements;
        this.size = response?.size;
      },
      error: (error: HttpErrorResponse) => {
        console.log("List bill : " + error.message);
      }
    });
  }

  public onPageChange(event: any) {
    this.loadBills(event.page, event.rows)
  }

}
