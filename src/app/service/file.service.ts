import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../shared/app-settings';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  REST_API = AppSettings.REST_API + '/FileUpload';
  constructor(private http: HttpClient) { }

  uploadFile(formData: FormData): Observable<string[]> {
    return this.http.post<string[]>(
      this.REST_API + '/multi',
      formData
      );
  }

}
