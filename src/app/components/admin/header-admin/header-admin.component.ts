import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss'],
})
export class HeaderAdminComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<boolean>();
  isShowSidebar = true;
  currentUser: any;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.storageService.currentUser.subscribe((data)=>{
      this.currentUser=data;
    });
  }
  addClassToParent() {
    this.isShowSidebar = !this.isShowSidebar;
    this.newItemEvent.emit(this.isShowSidebar);
  }

  public logout():void{
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
        this.router.navigate(['/']);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
