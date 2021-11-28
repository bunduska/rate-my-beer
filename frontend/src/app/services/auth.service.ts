import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { LocalStorageService } from './localstorage.service';
import jwt_decode from 'jwt-decode';

type JWTDecodedUser = {
  id: string; 
  username: string, 
  isAdmin: boolean,  
  email: string
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) { this.getCurrentUser();  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<any>(`${environment.api_url}/login`, { email, password })
      .pipe(
        map((user) => {
          if (user.message === undefined) {
            this.localStorageService.setItem('token', JSON.stringify(user))
          }
          return user;
        }),
      );
  }

  getCurrentUser() : JWTDecodedUser | null {
    let token = this.localStorageService.getItem('token');
    if (token) {
      let user: JWTDecodedUser = jwt_decode(token);
      return user;
    }
    return null;
  }

  logout(): void {
    this.localStorageService.removeItem('token');
    this.localStorageService.clear();
    window.location.reload();
  }
}
