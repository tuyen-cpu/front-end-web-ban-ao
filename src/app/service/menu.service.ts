import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../model/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiServerUrl ='http://localhost:3000';

  constructor(private http:HttpClient) { }

  public getMenus():Observable<Menu[]>{
    return this.http.get<Menu[]>(`${this.apiServerUrl}/category/menu`);
  }
}
