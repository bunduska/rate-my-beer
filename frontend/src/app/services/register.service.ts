import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post(`${environment.api_url}/register`, user);
  }
}
