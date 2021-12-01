import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Beer } from '../models/beer.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localstorage.service';

const PREFIX = 'Bearer';

@Injectable({
  providedIn: 'root',
})
export class BeerService {
  private headers: HttpHeaders | undefined;

  private beerSource = new BehaviorSubject<Beer[]>([]);
  currentBeerList = this.beerSource.asObservable();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
  ) {
    const token = JSON.parse(
      this.localStorageService.getItem('token') || (null as any),
    ).token;
    this.headers = new HttpHeaders({ Authorization: `${PREFIX} ${token} ` });
  }

  async saveBeer(beer: Beer) {
    return this.http.post<{ message: string }>(
      `${environment.api_url}/savebeer`,
      beer,
      { headers: this.headers },
    );
  }

  getBeerList(): Observable<Beer[]> {
    return this.http.get<Beer[]>(`${environment.api_url}/beerlist`, {
      headers: this.headers,
    });
  }

  updateBeerList(beers: Beer[]): void {
    this.beerSource.next(beers);
  }
}
