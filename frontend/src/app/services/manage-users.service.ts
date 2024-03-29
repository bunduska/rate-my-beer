import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './localstorage.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

const PREFIX = 'Bearer';

@Injectable({
  providedIn: 'root',
})
export class ManageUsersService {
  private headers: HttpHeaders | undefined;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
  ) {
    const token = JSON.parse(
      this.localStorageService.getItem('token') || (null as any),
    ).token;
    this.headers = new HttpHeaders({ Authorization: `${PREFIX} ${token} ` });
  }

  saveuser(user: User): Observable<void | { message: string }> {
    return this.http
      .post<{ message: string }>(`${environment.api_url}/user/update`, user, {
        headers: this.headers,
      })
      .pipe(
        catchError(async (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.authService.logout();
          }
        }),
      );
  }

  deleteuser(user: User): Observable<void | { message: string }> {
    return this.http
      .delete<{ message: string }>(`${environment.api_url}/user/delete`, {
        headers: this.headers,
        body: user,
      })
      .pipe(
        catchError(async (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.authService.logout();
          }
        }),
      );
  }

  getAllUsers(): Observable<void | User[]> {
    return this.http
      .get<User[]>(`${environment.api_url}/user/list`, {
        headers: this.headers,
      })
      .pipe(
        catchError(async (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.authService.logout();
          }
        }),
      );
  }
}
