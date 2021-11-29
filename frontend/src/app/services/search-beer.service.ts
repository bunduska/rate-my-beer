import { Injectable } from '@angular/core';
import { Beer } from '../models/beer.model';
import { config } from 'dotenv';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SearchBeerService {
  constructor(private http: HttpClient) {}

  searchBeer(search: string): Beer {
    config();
    let beerFound: Beer = {};
    let unTappdSerchstring: string = `https://api.untappd.com/v4/search/beer?q=${search}&client_id=${process.env.UNTAPPED_CLIENT_ID}&client_secret=${process.env.UNTAPPED_CLIENT_ID}`;

    console.log(process.env.UNTAPPED_CLIENT_ID);

    return beerFound;
  }
}
