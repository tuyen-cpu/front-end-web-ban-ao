import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../model/cart-item.model';
import { User } from '../model/user.model';

const USER_KEY = 'auth-user';
const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public userSource = new BehaviorSubject<any>(this.getUser());
  public currentUser = this.userSource.asObservable();
  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
    this.userSource.next(null);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSource.next(user);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }

  public isAdmin(): boolean {
    if(!this.isLoggedIn()){
      return false;
    }else{
      const user  = window.sessionStorage.getItem(USER_KEY);
      const result : User = JSON.parse(user);
      return result.roles.includes("admin");
    }
  }
  
  /*
  *  handle cart
  */
  public getCartItemList(): CartItem[] {
    const cartItemList = window.localStorage.getItem(CART_KEY);
    if (cartItemList) {
      return JSON.parse(cartItemList);
    }
    return [];
  }

  public saveCartItemList(cart: CartItem[]): void {
    window.localStorage.removeItem(CART_KEY);
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  public removeCartItemList(): void {
    window.localStorage.removeItem(CART_KEY);
  }

  
}
