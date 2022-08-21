import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-admin',
  templateUrl: './main-admin.component.html',
  styleUrls: ['./main-admin.component.scss'],
})
export class MainAdminComponent implements OnInit {
  isShowSidebar = true;
  constructor() {}
  ngOnInit(): void {}
  showSidebar(isShowSidebar: boolean) {
    this.isShowSidebar = isShowSidebar;
  }
}
