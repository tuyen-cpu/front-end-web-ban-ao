import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivateChild,CanActivate{

  constructor (private storageService: StorageService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("A-"+this.storageService.isAdmin())

    if (!this.storageService.isAdmin()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("Child-"+this.storageService.isAdmin())

    if (!this.storageService.isAdmin()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

}
