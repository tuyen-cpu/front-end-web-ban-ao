import { NavigationStart, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cdweb';
  isShowHeaderAndFooter: boolean = false;
  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'].includes('/admin')) {
          this.isShowHeaderAndFooter = false;
        } else {
          this.isShowHeaderAndFooter = true;
        }
      }
    });
  }
}
