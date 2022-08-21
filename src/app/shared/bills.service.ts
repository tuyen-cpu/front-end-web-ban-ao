import { Bill } from '../model/bill.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';
import { DetailBill } from '../model/detail-bill.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  REST_API = AppSettings.REST_API + '/bill';
  constructor(private http: HttpClient) {}
  getBills() {
    return this.http.get<Bill[]>(this.REST_API + '/all');
  }
  getBillsByUserId(id: number) {
    return this.http.get<Bill[]>(this.REST_API + `/allU?userId=${id}`);
  }

  getBillsById(id: number): Observable<DetailBill> {
    return this.http.get<DetailBill>(this.REST_API + `/${id}`);
  }

  getBillsInAdmin(page: number, size: number): Observable<DetailBill[]> {
    return this.http.get<DetailBill[]>(
      this.REST_API + '/all/admin?page=' + page + '&size=' + size,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  updateCancelledStatus(id: number[]): Observable<boolean> {
    return this.http.get<boolean>(
      this.REST_API + '/editStatus?id=' + id,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  updateStatus(id: number, status: number): Observable<boolean> {
    return this.http.get<boolean>(
      this.REST_API + '/updateStatus?id=' + id + '&status='+status,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}
