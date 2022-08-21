import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AttributeProduct } from '../model/attribute-product.model';
import { Attribute } from '../model/attribute.model';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  private apiServerUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  public getAttributesByCategoryId(
    cateId: number
  ): Observable<AttributeProduct[]> {
    return this.http.get<AttributeProduct[]>(
      `${this.apiServerUrl}/attribute/${cateId}`
    );
  }

  saveAttribute(attribute: Attribute): Observable<Attribute> {
    return this.http.post<Attribute>(
      `${this.apiServerUrl}/attribute` , JSON.stringify(attribute),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  updateStatus(id: number, status: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiServerUrl}/attribute/updateStatus?id=` + id + '&status=' + status,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  //check trong cùng category
  existsAttributeName(attributeName: string, value: string, catId: number): Observable<Boolean> {
    return this.http.get<Boolean>(
      `${this.apiServerUrl}/attribute`  + '/checkAttributeName?name=' + attributeName + '&value=' + value + '&categoryId=' + catId
    );
  }
}
