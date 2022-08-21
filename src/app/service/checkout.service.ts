import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Checkout } from '../model/checkout.model';
import { AppSettings } from '../shared/app-settings';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  REST_API = AppSettings.REST_API;

  constructor(private http: HttpClient) { }

  existsVoucher(code: string): Observable<Boolean> {
    return this.http.get<Boolean>(
      this.REST_API + '/voucher' + '/checkCode?code=' + code
    );
  }

  useVoucher(code: string): Observable<Number> {
    return this.http.get<Number>(
      this.REST_API + '/voucher' + '/useCode?code=' + code
    );
  }

  placeAnOrder(checkout: any): Observable<Number> {
    return this.http.post<number>(
      this.REST_API + '/order',
      JSON.stringify(checkout),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }


}
