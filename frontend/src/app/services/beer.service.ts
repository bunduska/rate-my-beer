import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Beer } from '../models/beer.model';
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
export class BeerService {
  private headers: HttpHeaders | undefined;

  private beerListSource = new BehaviorSubject<Beer[]>([]);
  currentBeerList = this.beerListSource.asObservable();

  private beerSource = new BehaviorSubject<Beer>({});
  currentBeer = this.beerSource.asObservable();

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

  saveBeer(beer: Beer): Observable<void | { message: string }> {
    return this.http
      .post<{ message: string }>(`${environment.api_url}/savebeer`, beer, {
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

  deleteBeer(beer: Beer): Observable<void | { message: string }> {
    return this.http
      .delete<{ message: string }>(`${environment.api_url}/deletebeer`, {
        headers: this.headers,
        body: beer,
      })
      .pipe(
        catchError(async (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.authService.logout();
          }
        }),
      );
  }

  getBeerList(): Observable<void | Beer[]> {
    return this.http
      .get<Beer[]>(`${environment.api_url}/beerlist`, {
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

  updateBeerList(beers: Beer[]): void {
    this.beerListSource.next(beers);
  }

  setCurrentBeer(beer: Beer): void {
    this.beerSource.next(beer);
  }
}
