import { Component, Input, OnInit } from '@angular/core';
import { DetailComment } from 'src/app/model/comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  
  @Input()
  public comment!: DetailComment;

  public val:number = 3;
  public urlImgs:string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.val = this.comment.star;
    if(this.comment.urlImg != ''){
      this.urlImgs = this.comment.urlImg.split(",");
    }
  }

}
