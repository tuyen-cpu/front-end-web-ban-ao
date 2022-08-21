import { Bill } from '../model/bill.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetailBill } from '../model/detail-bill.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../shared/app-settings';
import { Voucher } from '../model/voucher.model';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {

  REST_API = AppSettings.REST_API + '/voucher';
  constructor(private http: HttpClient) {}

  existsVoucher(code: string): Observable<Boolean> {
    return this.http.get<Boolean>(
      this.REST_API  + '/checkCode?code=' + code
    );
  }

  getVouchersInAdmin(page: number, size: number): Observable<DetailBill[]> {
    return this.http.get<DetailBill[]>(
      this.REST_API + '/all/admin?page=' + page + '&size=' + size,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  updateStatus(id: number[], status: number): Observable<boolean> {
    return this.http.get<boolean>(
      this.REST_API + '/updateStatus?id=' + id + '&status='+status,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  deleteVouchers(id: number[]): Observable<boolean> {
    return this.http.delete<boolean>(
      this.REST_API + '?id=' + id,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  saveVoucher(voucher: Voucher): Observable<Voucher> {
    return this.http.post<Voucher>(
      this.REST_API , JSON.stringify(voucher),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}
