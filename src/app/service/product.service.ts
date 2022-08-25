import { Image } from './../model/image.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { DetailProduct } from '../model/detail-product.model';
import { Pagination } from '../model/pagination.model';
import { Product, ProductAdd } from '../model/product.model';
import { GroupProduct } from '../model/group-product.model';
import { Size } from '../model/size.model';
import { ResponseObject } from '../model/response-object.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiServerUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getProducts(
    q: string,
    page: number,
    size: number
  ): Observable<Pagination> {
    return this.http.get<Pagination>(
      `${this.apiServerUrl}/product/all?q=${q}&page=${page}&size=${size}`
    );
  }
  searchGroupProduct(
    q: string,
    page: number,
    size: number
  ): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(
      this.apiServerUrl +
        '/group-product/search?q=' +
        q +
        '&page=' +
        page +
        '&size=' +
        size
    );
  }
  public getProductsManager(
    q: string,
    page: number,
    size: number
  ): Observable<Pagination> {
    return this.http.get<Pagination>(
      `${this.apiServerUrl}/product/all?q=${q}&page=${page}&size=${size}`
    );
  }
  public getGroupProductById(id: number): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(
      `${this.apiServerUrl}/group-product/${id}`
    );
  }
  public getProductsByCategoryId(
    id: number | null,
    page: number = 0,
    size: number = 12
  ): Observable<Pagination> {
    return this.http.get<Pagination>(
      `${this.apiServerUrl}/product/all/${id}?page=${page}&size=${size}`
    );
  }
  public getImagesByGroupProductId(
    productId: number
  ): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(
      `${this.apiServerUrl}/image/${productId}`
    );
  }
  public deleteImage(productId: number): Observable<ResponseObject> {
    return this.http.delete<ResponseObject>(
      `${this.apiServerUrl}/image/delete/${productId}`
    );
  }
  public getLongDescriptionById(productId: number) {
    return this.http.get(
      `${this.apiServerUrl}/product/` + productId + '/description',
      { responseType: 'text' }
    );
  }
  updateStatusGroupProductById(
    id: number,
    status: number
  ): Observable<boolean> {
    return this.http.get<boolean>(
      this.apiServerUrl +
        '/group-product/update-status?id=' +
        id +
        '&status=' +
        status
    );
  }
  public addImage(
    image: any[],
    groupProductId: number
  ): Observable<ResponseObject> {
    const f = [];
    image.forEach((img) => {
      f.push({ link: img, groupProductId: groupProductId });
    });
    return this.http.post<ResponseObject>(`${this.apiServerUrl}/image/add`, f);
  }

  public uploadFileImage(file: any): Observable<ResponseObject> {
    return this.http.post<ResponseObject>(
      `${this.apiServerUrl}/FileUpload`,
      file
    );
  }
  public getQuantityProductById(productId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiServerUrl}/product/` + productId + `/quantity`
    );
  }

  public getDetailProductById(productId: number): Observable<DetailProduct> {
    return this.http.get<DetailProduct>(
      `${this.apiServerUrl}/product/` + productId
    );
  }

  public addProduct(product: ProductAdd): Observable<ResponseObject> {
    return this.http.post<ResponseObject>(
      `${this.apiServerUrl}/product/add`,
      product
    );
  }

  public updateProduct(product: ProductAdd): Observable<ResponseObject> {
    {
      return this.http.put<ResponseObject>(
        `${this.apiServerUrl}/product/update`,
        product
      );
    }
  }

  public deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiServerUrl}/product/delete//${productId}`
    );
  }
  public searchProducts(key: string): Observable<Product[]> {
    //return this.http.get<Product[]>(`${this.apiServerUrl}/product`);
    return this.http.get<Product[]>(
      `${this.apiServerUrl}/product/instantSearch/query?key=${key}`
    );
  }

  public getPriceProductById(productId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiServerUrl}/product/` + productId + '/price'
    );
  }

  public filterProduct(paras: any): Observable<Pagination> {
    let params = new HttpParams();
    Object.keys(paras).forEach((k) => {
      params = params.set(k, paras[k]);
    });
    console.log({ params });
    return this.http.get<Pagination>(`${this.apiServerUrl}/product/filter`, {
      params: params,
    });
  }
  public getGroupProduct(
    page: number,
    size: number
  ): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(
      `${this.apiServerUrl}/group-product/all?page=${page}&size=${size}`
    );
  }
  public getGroupProductByCategoryId(
    id: number,
    page: number,
    size: number
  ): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(
      `${this.apiServerUrl}/group-product/all/category/${id}?page=${page}&size=${size}`
    );
  }
  public addGroupProduct(
    groupProduct: GroupProduct
  ): Observable<ResponseObject> {
    return this.http.post<ResponseObject>(
      `${this.apiServerUrl}/group-product/add`,
      groupProduct,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  getAllSize(page: number, size: number): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(
      this.apiServerUrl + '/size/all?page=' + page + '&size=' + size
    );
  }
  public getProductByGroupProductId(
    groupProductId: number
  ): Observable<ResponseObject> {
    return this.http.get<ResponseObject>(
      `${this.apiServerUrl}/product/group-product/` + groupProductId
    );
  }
}
