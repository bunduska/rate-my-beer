import { Injectable } from '@angular/core';
import { Beer } from '../models/beer.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BeerService {
  private headers: HttpHeaders | undefined;
  private messageFromBackend: string = '';

  constructor(private http: HttpClient) {}

  async saveBeer(beer: Beer) {
    return this.http.post<{ message: string }>(
      `${environment.api_url}/savebeer`,
      beer,
    );
  }
}
