import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { DetailComment } from 'src/app/model/comment.model';
import { CommentService } from 'src/app/service/comment.service';

@Component({
  selector: 'app-comment-manager',
  templateUrl: './comment-manager.component.html',
  styleUrls: ['./comment-manager.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class CommentManagerComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  selectedComments: DetailComment[] = [];
  comments: DetailComment[] = [];
  comment!: any;

  //pagination
  public totalRecords: number = 0;
  public currentPage: number = 0;
  public size: number = 5;

  public cols: any[] = [];
  public listStatuses: SelectItem[] = [];
  public selectedStatus: number = 0;
  public isLoading=false;

  constructor(
    private commentService: CommentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.initColumnsTable();
    this.loadComments(0, 5);
    this.initListStatus();
  }

  public loadComments(currentPage: number, size: number) {
    this.commentService.getCommentsInAdmin(currentPage, size).subscribe({
      next: (response: any) => {
        //console.log(response)
        this.comments = response?.content;
        this.currentPage = response?.number;
        this.totalRecords = response?.totalElements;
        this.size = response?.size;
      },
      error: (error: HttpErrorResponse) => {
        console.log("List comment : " + error.message);
      }
    });
  }

  initColumnsTable() {
    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'fullname', header: 'Fullname' },
      { field: 'content', header: 'Content' },
      { field: 'urlImg', header: 'Image' },
      { field: 'userId', header: 'User ID' },
      { field: 'productId', header: 'Product ID' },
      { field: 'status', header: 'Status' },
      { field: 'star', header: 'Star' },
      { field: 'createdDate', header: 'Created date' }
    ];
  }

  initListStatus() {
    this.listStatuses = [
      { label: 'Hoạt động', value: 1 },
      { label: 'Đã hủy', value: 0 }
    ]
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  applyColumnFilter($event: any, field: any, stringVal: any) {
    this.dt.filter(($event.target as HTMLInputElement).value, field, stringVal);
  }

  public onPageChange(event: any) {
    this.loadComments(event.page, event.rows)
  }

  deleteComment(comment) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete comment number ' + comment.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.commentService.deleteComments(comment.id).subscribe({
          next: (response: any) => {
            this.comments = this.comments.filter(val => val.id !== comment.id);
            this.comment = {};
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Comment Deleted', life: 3000 });
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The process errors', life: 3000 });
            console.log("Delete comment : " + error.message);
          }
        });
      }
    });
  }
  inactiveComment(comment) {
    this.commentService.updateStatus(comment.id, 0).subscribe({
      next: (response: any) => {
        const updatedCommentId = this.comments.findIndex((obj => obj.id == comment.id));
        this.comments[updatedCommentId].status = 0;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Comment was inactive', life: 3000 });
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The process errors', life: 3000 });
        console.log("Delete comments : " + error.message);
      }
    });
  }
  activeComment(comment) {
    this.commentService.updateStatus(comment.id, 1).subscribe({
      next: (response: any) => {
        const updatedCommentId = this.comments.findIndex((obj => obj.id == comment.id));
        this.comments[updatedCommentId].status = 1;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Comment was active', life: 3000 });
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The process errors', life: 3000 });
        console.log("Delete comments : " + error.message);
      }
    });
  }
  deleteSelectedComments() {
    this.isLoading=true;
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected comments?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = this.selectedComments.map((obj) => obj.id);
        this.commentService.deleteComments(ids).subscribe({
          next: (response: any) => {
            this.comments = this.comments.filter(val => !this.selectedComments.includes(val));
            this.selectedComments = [];
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Comments Deleted', life: 3000 });
            this.isLoading=false;
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The process errors', life: 3000 });
            console.log("Delete comments : " + error.message);
            this.isLoading=false;
          }
        });

      }
    });
  }
  getImgs(urls: string) {
    if (urls != null && urls != '') {
      return urls.split(',');
    } else {
      return [];
    }
  }
}
