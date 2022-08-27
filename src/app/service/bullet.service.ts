import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/category.model';
import { ResponseObject } from '../model/response-object.model';
import { AppSettings } from '../shared/app-settings';

@Injectable({
  providedIn: 'root',
})
export class BulletService {
  REST_API = AppSettings.REST_API + '/bulletin';
  constructor(private http: HttpClient) {}
  getByUserId(userId: number): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(this.REST_API + '/all/' + userId);
  }
  update(bullet: any): Observable<ResponseObject> {
    return this.http.put<ResponseObject>(this.REST_API + '/update', bullet);
  }
  add(bullet: any): Observable<ResponseObject> {
    return this.http.post<ResponseObject>(this.REST_API + '/add', bullet);
  }
}
