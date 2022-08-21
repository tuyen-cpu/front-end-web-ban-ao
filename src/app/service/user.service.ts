import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/message.model';
import { User } from '../model/user.model';
const API_URL = 'http://localhost:3000/user';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  existsUsername(username: string): Observable<Boolean> {
    return this.http.get<Boolean>(
      API_URL + '/checkUsername?username=' + username
    );
  }

  existsEmail(email: string): Observable<Boolean> {
    return this.http.get<Boolean>(
      API_URL + '/checkEmail?email=' + email
    );
  }

  newUser(user: User): Observable<User> {
    return this.http.post<User>(
      API_URL, JSON.stringify(user),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  getUsersInAdmin(page: number, size: number): Observable<User[]> {
    return this.http.get<User[]>(
      API_URL + '/all/admin?page=' + page + '&size=' + size,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  updateDeletedStatus(id: number[]): Observable<boolean> {
    return this.http.get<boolean>(
      API_URL + '/editStatus?id=' + id,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.http.get<boolean>(
      API_URL + '/forgot_password?email=' + email
    );
  }

  checkValidToken(token: string): Observable<boolean> {
    return this.http.get<boolean>(
      API_URL + '/checkToken?token=' + token,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  updatePassword(token:string, password: string): Observable<string> {
    return this.http.post<string>(
      API_URL + '/reset_password',{"token":token, "password": password},
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
  
}
