import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../model/address.model';
import { AppSettings } from './app-settings';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  REST_API = AppSettings.REST_API + '/address';
  constructor(private http: HttpClient) {}
  getAddresses() {
    return this.http.get<Address[]>(this.REST_API + `/all`);
  }
  getAddressesByUserId(id: number) {
    return this.http.get<Address[]>(this.REST_API + `/all/user${id}`);
  }

  getAddressesById(id: number) {
    return this.http.get<Address>(this.REST_API + `/${id}`);
  }
}
